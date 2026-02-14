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
                match general_purpose::STANDARD.decode(input.value) {
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
            _ => { // Default to encode
                let encoded = general_purpose::STANDARD.encode(input.value);
                ToolOutput {
                    result: encoded,
                    error: None,
                }
            }
        }
    }
}
