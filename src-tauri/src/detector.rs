use base64::{engine::general_purpose, Engine as _};

#[derive(Debug, PartialEq)]
pub struct DetectionResult {
    pub tool_id: &'static str,
    pub confidence: f32,
}

pub fn detect(input: &str) -> Option<DetectionResult> {
    let input = input.trim();
    if input.is_empty() { return None; }

    // 1. JSON Detection (Strict)
    if (input.starts_with('{') && input.ends_with('}')) || (input.starts_with('[') && input.ends_with(']')) {
        if serde_json::from_str::<serde_json::Value>(input).is_ok() {
            return Some(DetectionResult {
                tool_id: "json_formatter",
                confidence: 1.0,
            });
        }
    }

    // 2. Base64 Detection
    // Criteria: Valid base64 chars, length multiple of 4 (if padded), and at least 12 chars to avoid plain words
    if input.len() >= 12 && input.chars().all(|c| c.is_alphanumeric() || c == '+' || c == '/' || c == '=') {
        if general_purpose::STANDARD.decode(input).is_ok() {
            return Some(DetectionResult {
                tool_id: "base64",
                confidence: 0.8,
            });
        }
    }

    None
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_detect_json_object() {
        let input = r#"{"key": "value", "number": 123}"#;
        let result = detect(input);
        assert_eq!(result, Some(DetectionResult { tool_id: "json_formatter", confidence: 1.0 }));
    }

    #[test]
    fn test_detect_json_array() {
        let input = r#"[1, 2, 3, "test"]"#;
        let result = detect(input);
        assert_eq!(result, Some(DetectionResult { tool_id: "json_formatter", confidence: 1.0 }));
    }

    #[test]
    fn test_detect_base64() {
        let input = "SGVsbG8gV29ybGQh"; // "Hello World!"
        let result = detect(input);
        assert_eq!(result, Some(DetectionResult { tool_id: "base64", confidence: 0.8 }));
    }

    #[test]
    fn test_detect_none_on_plain_text() {
        let input = "This is just a normal sentence that is not JSON or Base64.";
        let result = detect(input);
        assert_eq!(result, None);
    }

    #[test]
    fn test_detect_none_on_short_string() {
        let input = "SGVsbG8="; // "Hello" but too short for high-confidence base64 detection
        // Our current logic requires len >= 8
        let result = detect(input);
        assert_eq!(result, None);
    }
}
