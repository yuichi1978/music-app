import { useEffect, useRef, useState } from "react";

import spotify from "./lib/spotify";
import { SongList } from "./components/SongList";
import { Player } from "./components/Player";
import { SearchInput } from "./components/SearchInput";
import { Pagination } from "./components/Pagination";

// limit手定数を作りpaginationの件数を20件と定義する
const limit = 20;

export default function App() {
  // 曲の情報を格納するstateを定義する
  const [popularSongs, setPopularSongs] = useState([]);
  // ローディングの状態を管理するstateを定義する
  const [isLoading, setLoading] = useState(false);
  // 選択した曲の情報を格納するstateを定義する
  const [selectedSong, setSelectedSong] = useState();
  // 音楽の再生と停止のstateを定義する
  const [isPlay, setIsPlay] = useState(false);
  // 検索キーワードを入れるstateを定義する
  const [keyword, setKeyword] = useState("");
  // 検索結果を入れるstateを定義する
  const [searchedSongs, setSearchedSongs] = useState();
  // 現在何ページ目の検索結果が表示しているのか調べるstateを定義する
  const [page, setPage] = useState(1);
  // 前のページがあるのか格納するstateを定義する
  const [hasNext, setHasNext] = useState(false);
  // 次のページがあるのか格納するstateを定義する
  const [hasPrev, setHasPrev] = useState(false);
  // useRefを使いオーディオタグに渡す
  const audioRef = useRef(null);
  // 検索結果があるのかわかりやすく searchedSongsがればtrueで検索していなければfalseになる
  const isSearchResult = searchedSongs != null;

  // ページ表示に対して一度だけ発火させるためuseEffectを使う
  useEffect(() => {
    fetchPopularSongs();
  }, []);

  //
  const fetchPopularSongs = async () => {
    // APIをたたく直前にsetLoadingでローディングさせる
    setLoading(true);
    const result = await spotify.getPopularSongs();
    // popularSongsにtrackの配列が入った
    const popularSongs = result.items.map((item) => {
      // item.trackに曲の情報が入っている
      return item.track;
    });
    setPopularSongs(popularSongs);
    // ローディングをfalseで消す
    setLoading(false);
  };

  // 曲を選択したsongの情報を渡す
  const handleSongSelected = async (song) => {
    // 渡してきたsongの情報をsetSelectedSongに渡す
    setSelectedSong(song);
    // もしもsong.preview_urlが存在するときと存在しないときの処理を記述する
    if (song.preview_url != null) {
      // Refにも曲の情報を渡す
      // こちらを設定することでRefを通じて再生する曲のURLがセットされる
      audioRef.current.src = song.preview_url;
      playSong();
    } else {
      // エラーになるためpalySongをよばいないようにする
      // pauseSongで音楽が止まるようになる
      pauseSong();
    }
  };

  // 音楽を再生するメソッドを記述する
  const playSong = () => {
    // さらにaudioRef.current.playを呼び出すことで音楽が再生される
    audioRef.current.play();
    setIsPlay(true);
  };

  // 曲を停止するpauseSongメソッドを記述する
  const pauseSong = () => {
    // 曲を停止するpauseメソッド
    audioRef.current.pause();
    setIsPlay(false);
  };

  // 音楽を再生するようなメソッドを記述する
  const toggleSong = () => {
    if (isPlay) {
      pauseSong();
    } else {
      playSong();
    }
  };

  // inputのイベントを受け取るメソッドを記述する
  const handleInputChange = (e) => {
    setKeyword(e.target.value);
  };

  // 検索キーワードをAPIに投げる処理を実装する
  // 引数にpage数をわたすため入れる
  const searchSongs = async (page) => {
    setLoading(true);
    // 三項演算子で0は数字にできない値を渡ってきたときには0がoffsetにわたる無効的な値になる
    const offset = parseInt(page) ? (parseInt(page) - 1) * limit : 0;
    // APIをたたくのでspotify.searchSongsを呼び出してkeywordのstateを引数に入れる
    // limitでページ数の件数を定義するため引数に入れる
    const result = await spotify.searchSongs(keyword, limit, offset);
    // setHasNextにresult.nextがnullでなければ次のページにtrueを返す
    setHasNext(result.next != null);
    // setHasNextにresult.nextがnullでなければ次のページにtrueを返す
    setHasPrev(result.previous != null);
    // searchSongsの中のresultの中身を確認できる
    console.log(result);

    // setSearchedSongsのstateにAPIから返ってきた検索結果が反映される
    setSearchedSongs(result.items);
    setLoading(false);
  };

  // nextボタンをクリックしたときのAPIの処理を定義する
  const moveToNext = async () => {
    // nextPageの定数から現在のpageからプラス１にしたもの
    const nextPage = page + 1;
    await searchSongs(nextPage);
    // setPage現在のページから次のページに更新する
    setPage(nextPage);
  };

  // prevボタンをクリックしたときのAPIの処理を定義する
  const moveToPrev = async () => {
    const prevPage = page - 1;
    await searchSongs(prevPage);
    setPage(prevPage);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-900 text-white">
      <main className="flex-1 p-8 mb-20">
        <header className="flex justify-between items-center mb-10">
          <h1 className="text-4xl font-bold">Music App</h1>
        </header>
        <SearchInput onInputChange={handleInputChange} onSubmit={searchSongs} />
        <section>
          <h2 className="text-2xl font-semibold mb-5">
            {/* 検索バーで検索表示されたらSearched Resultsが表示されデフォルトの時はPopular Songsが表示される */}
            {isSearchResult ? "Searched Results" : "Popular Songs"}
          </h2>
          <SongList
            isLoading={isLoading}
            // searchedSongがtrueであれば表示してなければpopularSongsを表示させる
            songs={isSearchResult ? searchedSongs : popularSongs}
            onSongSelected={handleSongSelected}
          />
          {/* isSearchResultで検索結果が表示されたらpaginationコンポーネントが表示される */}
          {isSearchResult && (
            <Pagination
              onPrev={hasPrev ? moveToPrev : null}
              onNext={hasNext ? moveToNext : null}
            />
          )}
        </section>
      </main>
      {/* 選択したstateのselectedSongがnullでないときtrueのときのみ表示する */}
      {/* songのpropsに対してselectedSongのstateを渡す */}
      {selectedSong != null && (
        <Player
          song={selectedSong}
          isPlay={isPlay}
          onButtonClick={toggleSong}
        />
      )}
      {/* 曲が選択されたときのみだけに表示する */}
      {/* オーディオタグ */}
      <audio ref={audioRef} />
    </div>
  );
}
