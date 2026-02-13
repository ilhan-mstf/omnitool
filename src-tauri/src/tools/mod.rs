use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize)]
pub enum ToolCategory {
    Encoder,
    Formatter,
    Generator,
    Converter,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct ToolInput {
    pub value: String,
    pub options: serde_json::Value,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct ToolOutput {
    pub result: String,
    pub error: Option<String>,
}

pub trait Tool {
    fn id(&self) -> &'static str;
    fn name(&self) -> &'static str;
    fn category(&self) -> ToolCategory;
    
    fn execute(&self, input: ToolInput) -> ToolOutput;
}

pub mod base64_tool;
pub mod json_tool;
