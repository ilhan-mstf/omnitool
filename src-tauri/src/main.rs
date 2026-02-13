// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod tools;
mod detector;
use tools::{Tool, ToolInput, ToolOutput, base64_tool::Base64Tool};

#[tauri::command]
fn detect_clipboard(text: String) -> Option<String> {
    detector::detect(&text).map(|res| res.tool_id.to_string())
}

#[tauri::command]
fn execute_tool(id: String, input: ToolInput) -> ToolOutput {
    let tool: Box<dyn Tool> = match id.as_str() {
        "base64" => Box::new(Base64Tool),
        _ => return ToolOutput {
            result: "".to_string(),
            error: Some(format!("Tool '{}' not found", id)),
        },
    };

    tool.execute(input)
}

fn main() {
    tauri::Builder::default()
        .plugin(tauri_plugin_clipboard_manager::init())
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![execute_tool, detect_clipboard])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
