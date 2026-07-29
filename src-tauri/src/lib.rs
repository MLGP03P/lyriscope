use serde::Serialize;
use serde::Deserialize;
use lofty::probe::Probe;
use lofty::tag::Accessor;
use lofty::file::TaggedFileExt;

#[derive(Serialize)]
pub struct SongMetadata {
    title: Option<String>,
    artist: Option<String>,
    album: Option<String>,
    picture: Option<Vec<u8>>,
    mime_type: Option<String>,
}

#[derive(Deserialize)]
struct LrcLibResponse {
    #[serde(rename = "syncedLyrics")]
    synced_lyrics: Option<String>,
    #[serde(rename = "plainLyrics")]
    plain_lyrics: Option<String>,
}

#[tauri::command]
async fn fetch_online_lyrics(title: String, artist: String) -> Result<String, String> {
    let client = reqwest::Client::new();
    
    let response = client.get("https://lrclib.net/api/get")
        .query(&[("track_name", &title), ("artist_name", &artist)])
        .send()
        .await
        .map_err(|e| format!("Network error: {}", e))?;

    if response.status().is_success() {
        let json_data: LrcLibResponse = response.json().await.map_err(|e| format!("JSON error: {}", e))?;
        
        if let Some(synced) = json_data.synced_lyrics {
            return Ok(synced);
        } else if let Some(plain) = json_data.plain_lyrics {
            return Ok(plain);
        } else {
            return Err("Lyrics empty in response".to_string());
        }
    }

    Err("Lyrics not found on LRCLIB".to_string())
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
        picture: None,
        mime_type: None,
    };

    if let Some(tag) = tag {
        metadata.title = tag.title().map(|s| s.into_owned());
        metadata.artist = tag.artist().map(|s| s.into_owned());
        metadata.album = tag.album().map(|s| s.into_owned());

        if let Some(pic) = tag.pictures().first() {
            metadata.picture = Some(pic.data().to_vec());
            metadata.mime_type = Some(
                pic.mime_type()
                    .map(|m| m.as_str().to_string())
                    .unwrap_or_else(|| "image/jpeg".to_string())
            );
        }
    }

    Ok(metadata)
}

#[tauri::command]
fn read_lrc_file(path: String) -> Result<String, String> {
    std::fs::read_to_string(&path).map_err(|e| e.to_string())
}

// Structura pentru o melodie din librărie
#[derive(serde::Serialize)]
pub struct LibrarySong {
    path: String,
    title: Option<String>,
    artist: Option<String>,
    album: Option<String>,
    duration: Option<u64>,
}

#[tauri::command]
fn pick_folder() -> Option<String> {
    rfd::FileDialog::new()
        .pick_folder()
        .map(|p| p.display().to_string())
}

use lofty::file::AudioFile;

#[tauri::command]
fn scan_folder(folder_path: String) -> Vec<LibrarySong> {
    let mut songs = Vec::new();
    let mut dirs_to_scan = vec![std::path::PathBuf::from(folder_path)];

    while let Some(dir) = dirs_to_scan.pop() {
        if let Ok(entries) = std::fs::read_dir(dir) {
            for entry in entries.flatten() {
                let path = entry.path();
                if path.is_dir() {
                    dirs_to_scan.push(path);
                } else if path.is_file() {
                    let ext = path.extension().and_then(|e| e.to_str()).unwrap_or("").to_lowercase();
                    if matches!(ext.as_str(), "mp3" | "flac" | "wav" | "m4a" | "ogg") {
                        let mut song = LibrarySong {
                            path: path.to_string_lossy().to_string(),
                            title: None,
                            artist: None,
                            album: None,
                            duration: None,
                        };


                        if let Ok(tagged_file) = lofty::read_from_path(&path) {
                            if let Some(tag) = tagged_file.primary_tag().or_else(|| tagged_file.first_tag()) {
                                song.title = tag.title().map(|s| s.into_owned());
                                song.artist = tag.artist().map(|s| s.into_owned());
                                song.album = tag.album().map(|s| s.into_owned());
                            }
                            song.duration = Some(tagged_file.properties().duration().as_secs());
                        }
                        songs.push(song);
                    }
                }
            }
        }
    }
    songs
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init()) 
        .invoke_handler(tauri::generate_handler![read_metadata, read_lrc_file, save_lrc_file, pick_folder, scan_folder, fetch_online_lyrics]) 
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
#[tauri::command]
fn save_lrc_file(song_path: String, lrc_content: String) -> Result<(), String> {
    let mut path = std::path::PathBuf::from(song_path);
    path.set_extension("lrc");

    std::fs::write(&path, lrc_content).map_err(|e| e.to_string())
}