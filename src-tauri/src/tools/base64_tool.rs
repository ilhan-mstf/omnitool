use super::{Tool, ToolCategory, ToolInput, ToolOutput};
use base64::{engine::general_purpose, Engine as _};

pub struct Base64Tool;

impl Tool for Base64Tool {
    fn id(&self) -> &'static str { "base64" }
    fn name(&self) -> &'static str { "Base64 Encoder/Decoder" }
    fn category(&self) -> ToolCategory { ToolCategory::Encoder }

    fn execute(&self, input: ToolInput) -> ToolOutput {
        let action = input.options.get("action").and_then(|v| v.as_str()).unwrap_or("encode");

        match action {
            "decode" => {
                match general_purpose::STANDARD.decode(input.value.trim()) {
                    Ok(decoded) => ToolOutput {
                        result: String::from_utf8_lossy(&decoded).to_string(),
                        error: None,
                    },
                    Err(e) => ToolOutput {
                        result: "".to_string(),
                        error: Some(format!("Decoding failed: {}", e)),
                    },
                }
            },
            _ => {
                let encoded = general_purpose::STANDARD.encode(input.value);
                ToolOutput {
                    result: encoded,
                    error: None,
                }
            }
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use serde_json::json;

    #[test]
    fn test_base64_encode() {
        let tool = Base64Tool;
        let input = ToolInput {
            value: "Hello World".to_string(),
            options: json!({ "action": "encode" }),
        };
        let output = tool.execute(input);
        assert_eq!(output.result, "SGVsbG8gV29ybGQ=");
        assert!(output.error.is_none());
    }

    #[test]
    fn test_base64_decode() {
        let tool = Base64Tool;
        let input = ToolInput {
            value: "SGVsbG8gV29ybGQ=".to_string(),
            options: json!({ "action": "decode" }),
        };
        let output = tool.execute(input);
        assert_eq!(output.result, "Hello World");
        assert!(output.error.is_none());
    }

    #[test]
    fn test_base64_decode_invalid() {
        let tool = Base64Tool;
        let input = ToolInput {
            value: "!!!Invalid!!!".to_string(),
            options: json!({ "action": "decode" }),
        };
        let output = tool.execute(input);
        assert!(output.error.is_some());
        assert_eq!(output.result, "");
    }
}
