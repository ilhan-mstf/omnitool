use super::{Tool, ToolCategory, ToolInput, ToolOutput};
use base64::{engine::general_purpose, Engine as _};
use serde_json::{Value, json};

pub struct JwtTool;

impl Tool for JwtTool {
    fn id(&self) -> &'static str { "jwt_debugger" }
    fn name(&self) -> &'static str { "JWT Debugger" }
    fn category(&self) -> ToolCategory { ToolCategory::Converter }

    fn execute(&self, input: ToolInput) -> ToolOutput {
        let parts: Vec<&str> = input.value.trim().split('.').collect();
        
        if parts.len() < 2 {
            return ToolOutput {
                result: "".to_string(),
                error: Some("Invalid JWT format: Missing segments".to_string()),
            };
        }

        let header_json = decode_segment(parts[0]);
        let payload_json = decode_segment(parts[1]);

        let combined = json!({
            "header": header_json.unwrap_or(Value::Null),
            "payload": payload_json.unwrap_or(Value::Null),
            "signature_present": parts.len() > 2
        });

        match serde_json::to_string_pretty(&combined) {
            Ok(res) => ToolOutput { result: res, error: None },
            Err(e) => ToolOutput { result: "".to_string(), error: Some(e.to_string()) },
        }
    }
}

fn decode_segment(seg: &str) -> Option<Value> {
    // Base64URL decoding (no padding)
    let mut seg_padded = seg.to_string();
    while seg_padded.len() % 4 != 0 {
        seg_padded.push('=');
    }
    
    // JWT uses URL-safe base64
    let decoded = general_purpose::URL_SAFE.decode(seg_padded).ok()?;
    serde_json::from_slice(&decoded).ok()
}
