use super::{Tool, ToolCategory, ToolInput, ToolOutput};
use urlencoding::{encode, decode};

pub struct UrlTool;

impl Tool for UrlTool {
    fn id(&self) -> &'static str { "url_encoder" }
    fn name(&self) -> &'static str { "URL Encoder/Decoder" }
    fn category(&self) -> ToolCategory { ToolCategory::Encoder }

    fn execute(&self, input: ToolInput) -> ToolOutput {
        let action = input.options.get("action").and_then(|v| v.as_str()).unwrap_or("encode");

        match action {
            "decode" => {
                match decode(&input.value) {
                    Ok(decoded) => ToolOutput {
                        result: decoded.into_owned(),
                        error: None,
                    },
                    Err(e) => ToolOutput {
                        result: "".to_string(),
                        error: Some(format!("Decoding failed: {}", e)),
                    },
                }
            },
            _ => { // encode
                let encoded = encode(&input.value);
                ToolOutput {
                    result: encoded.into_owned(),
                    error: None,
                }
            }
        }
    }
}
