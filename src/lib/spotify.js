import axios from "axios";

// spotify関連の情報を記述する
class SpotifyClient {
  // トークンを取得してメンバー変数に入れる 初期化処理の処理を行う
  static async initialize() {
    // axiosを使いアクセストークンを取得する axiosを使いポストメソッドでアクセスする
    const response = await axios.post(
      "https://accounts.spotify.com/api/token",
      {
        // grant_typeキーを設定する
        // client_credentials値を設定
        grant_type: "client_credentials",
        // client_idがキーを設定
        client_id: process.env.REACT_APP_SPOTIFY_CLIENT_ID,
        client_secret: process.env.REACT_APP_SPOTIFY_CLIENT_SECRET,
      },
      {
        headers: {
          // Content-Typeキーを設定して
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    // responseの中身をメンバー変数に格納する
    // spotifyClientのインスタンス化を作る
    let spotify = new SpotifyClient();
    // spotify.tokenの変数名で
    spotify.token = response.data.access_token;
    // 最後に作ったインスタンス化を返す
    return spotify;
    // アクセストークンの情報がresponseの中に入った
    console.log(response.data);
  }

  // 人気のAPIを取得する実装
  async getPopularSongs() {
    const response = await axios.get(
      // このエンドポイントはhttps://developer.spotify.com/documentation/web-api/reference/get-playlists-tracksから取得した
      "https://api.spotify.com/v1/playlists/37i9dQZF1DX9vYRBO9gjDe/tracks",
      {
        headers: {
          // Bearerスペースthis.tokenをAuthorizationに入れる
          Authorization: "Bearer " + this.token,
        },
      }
    );
    return response.data;
  }

  // 曲の検索バーを選択した時のAPIを取得するメソッドを記述する
  async searchSongs(keyword, limit, offset) {
    // このエンドポイントはhttps://api.spotify.com/v1/search
    const response = await axios.get("https://api.spotify.com/v1/search", {
      headers: { Authorization: "Bearer " + this.token },
      params: { q: keyword, type: "track", limit, offset },
    });
    return response.data.tracks;
  }
}

// SpotifyClientのinitializeメソッドを呼び返ってきた
const spotify = await SpotifyClient.initialize();
export default spotify;
