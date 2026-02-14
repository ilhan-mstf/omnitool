// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod tools;
mod detector;
use tools::{Tool, ToolInput, ToolOutput, base64_tool::Base64Tool, json_tool::JsonTool, url_tool::UrlTool, jwt_tool::JwtTool};

#[tauri::command]
fn detect_clipboard(text: String) -> Option<detector::DetectionResult> {
    println!("Backend detecting text (len: {})", text.len());
    let res = detector::detect(&text);
    println!("Detection result: {:?}", res);
    res
}

#[tauri::command]
fn execute_tool(id: String, input: ToolInput) -> ToolOutput {
    let tool: Box<dyn Tool> = match id.as_str() {
        "base64" => Box::new(Base64Tool),
        "json_formatter" => Box::new(JsonTool),
        "url_encoder" => Box::new(UrlTool),
        "jwt_debugger" => Box::new(JwtTool),
        _ => return ToolOutput {
            result: "".to_string(),
            error: Some(format!("Tool '{}' not found", id)),
        },
    };

    tool.execute(input)
}

#[tauri::command]
async fn check_for_updates() -> Option<String> {
    let url = "https://api.github.com/repos/ilhan-mstf/omnitool/releases/latest";
    let client = reqwest::Client::new();
    
    match client.get(url)
        .header("User-Agent", "omnitool-app")
        .send()
        .await {
            Ok(resp) => {
                if let Ok(json) = resp.json::<serde_json::Value>().await {
                    let latest_tag = json["tag_name"].as_str()?;
                    let current_version = format!("v{}", env!("CARGO_PKG_VERSION"));
                    if latest_tag != current_version {
                        return Some(latest_tag.to_string());
                    }
                }
            },
            Err(e) => println!("Update check failed: {}", e),
        }
    None
}

fn main() {
    tauri::Builder::default()
        .plugin(tauri_plugin_clipboard_manager::init())
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![execute_tool, detect_clipboard, check_for_updates])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
