// このコンポーネントファイルは曲を表示する一覧ページになる

import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

// あとは曲をローディングする作るコンポーネント
export function SongList(props) {
  // isLoadingがtrueであればFontAwesomeIconが表示される
  if (props.isLoading)
    return (
      <div className="inset-0 flex justify-center items-center">
        {/* ローディング部分が表示する */}
        <FontAwesomeIcon icon={faSpinner} spin size="3x" />
      </div>
    );

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
      {/* songsのpropsをmapでループさせ情報を一つ一つ取る */}
      {props.songs.map((song) => {
        return (
          <div 
            // 注意する点としてonSongSelectedの引数に選択した曲の情報を渡す
            // map関数でのsongを引数に必ず入れる
            onClick={() => props.onSongSelected(song)}
            key={song.id}
            className="flex-none cursor-pointer "
          >
            <img
              alt="thumbnail"
              src={song.album.images[0].url}
              className="mb-2 rounded"
            />
            <h3 className="text-lg font-semibold">{song.name}</h3>
            <p className="text-gray-400">By {song.artists[0].name}</p>
          </div>
        );
      })}
    </div>
  );
}
