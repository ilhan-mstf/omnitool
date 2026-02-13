use base64::{engine::general_purpose, Engine as _};
use serde::{Serialize, Deserialize};

#[derive(Debug, PartialEq, Serialize, Deserialize)]
pub struct DetectionResult {
    pub tool_id: String,
    pub confidence: f32,
    pub initial_options: serde_json::Value,
}

pub fn detect(input: &str) -> Option<DetectionResult> {
    let input = input.trim();
    if input.is_empty() { return None; }

    // 1. JSON Detection
    if (input.starts_with('{') && input.ends_with('}')) || (input.starts_with('[') && input.ends_with(']')) {
        if serde_json::from_str::<serde_json::Value>(input).is_ok() {
            return Some(DetectionResult {
                tool_id: "json_formatter".to_string(),
                confidence: 1.0,
                initial_options: serde_json::json!({ "indent": 2 }),
            });
        }
    }

    // 2. Base64 Detection
    if input.len() >= 12 && input.chars().all(|c| c.is_alphanumeric() || c == '+' || c == '/' || c == '=') {
        if general_purpose::STANDARD.decode(input).is_ok() {
            return Some(DetectionResult {
                tool_id: "base64".to_string(),
                confidence: 0.8,
                // If we detect Base64, the logical action is to DECODE it
                initial_options: serde_json::json!({ "action": "decode" }),
            });
        }
    }

    None
}
