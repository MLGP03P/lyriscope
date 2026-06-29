use serde::Serialize;
use lofty::probe::Probe;
use lofty::tag::Accessor;
use lofty::file::TaggedFileExt; 

#[derive(Serialize)]
pub struct SongMetadata {
    title: Option<String>,
    artist: Option<String>,
    album: Option<String>,
}

#[tauri::command]
fn read_metadata(path: String) -> Result<SongMetadata, String> {
    let tagged_file = Probe::open(&path)
        .map_err(|e| e.to_string())?
        .read()
        .map_err(|e| e.to_string())?;

    let tag = match tagged_file.primary_tag() {
        Some(primary_tag) => Some(primary_tag),
        None => tagged_file.first_tag(),
    };

    let mut metadata = SongMetadata {
        title: None,
        artist: None,
        album: None,
    };

    if let Some(tag) = tag {
        metadata.title = tag.title().map(|s| s.into_owned());
        metadata.artist = tag.artist().map(|s| s.into_owned());
        metadata.album = tag.album().map(|s| s.into_owned());
    }

    Ok(metadata)
}

#[tauri::command]
fn read_lrc_file(path: String) -> Result<String, String> {
    std::fs::read_to_string(&path).map_err(|e| e.to_string())
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init()) 
        .invoke_handler(tauri::generate_handler![read_metadata, read_lrc_file]) 
        .run(tauri::generate_context!())
        .expect("eroare la pornirea aplicatiei tauri");
}