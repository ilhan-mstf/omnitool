use super::{Tool, ToolCategory, ToolInput, ToolOutput};
use serde_json::{Value, ser::PrettyFormatter, Serializer};
use serde::Serialize;

pub struct JsonTool;

impl Tool for JsonTool {
    fn id(&self) -> &'static str { "json_formatter" }
    fn name(&self) -> &'static str { "JSON Formatter" }
    fn category(&self) -> ToolCategory { ToolCategory::Formatter }

    fn execute(&self, input: ToolInput) -> ToolOutput {
        let indent_size = input.options.get("indent").and_then(|v| v.as_u64()).unwrap_or(2) as usize;
        let minify = input.options.get("minify").and_then(|v| v.as_bool()).unwrap_or(false);

        let value: Value = match serde_json::from_str(&input.value) {
            Ok(v) => v,
            Err(e) => return ToolOutput {
                result: "".to_string(),
                error: Some(format!("Invalid JSON: {}", e)),
            },
        };

        if minify {
            match serde_json::to_string(&value) {
                Ok(res) => ToolOutput { result: res, error: None },
                Err(e) => ToolOutput { result: "".to_string(), error: Some(e.to_string()) },
            }
        } else {
            let mut buf = Vec::new();
            let indent = " ".repeat(indent_size);
            let formatter = PrettyFormatter::with_indent(indent.as_bytes());
            let mut ser = Serializer::with_formatter(&mut buf, formatter);
            
            if let Err(e) = value.serialize(&mut ser) {
                return ToolOutput { result: "".to_string(), error: Some(e.to_string()) };
            }

            match String::from_utf8(buf) {
                Ok(res) => ToolOutput { result: res, error: None },
                Err(e) => ToolOutput { result: "".to_string(), error: Some(e.to_string()) },
            }
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use serde_json::json;

    #[test]
    fn test_json_format() {
        let tool = JsonTool;
        let input = ToolInput {
            value: r#"{"a":1,"b":2}"#.to_string(),
            options: json!({ "indent": 2 }),
        };
        let output = tool.execute(input);
        assert_eq!(output.result, "{\n  \"a\": 1,\n  \"b\": 2\n}");
    }

    #[test]
    fn test_json_minify() {
        let tool = JsonTool;
        let input = ToolInput {
            value: "{\n  \"a\": 1\n}".to_string(),
            options: json!({ "minify": true }),
        };
        let output = tool.execute(input);
        assert_eq!(output.result, "{\"a\":1}");
    }
}
