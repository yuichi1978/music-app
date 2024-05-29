import { faPlayCircle, faStopCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export function Player(props) {
  return (
    <footer className="fixed bottom-0 w-full bg-gray-800 p-5">
      <div className="grid grid-cols-2">
        <div className="flex items-center">
          <img
            // 曲のアルバムの画像のURLが取得できた
            src={props.song.album.images[0].url}
            alt="thumbnail"
            className="rounded-full mr-3 h-[50px] w-[50px]"
          />
          <div>
            <p className="text-sm font-semibold">{props.song.name}</p>
            <p className="text-xs text-gray-400">
              {props.song.artists[0].name}
            </p>
          </div>
        </div>
        <div className="flex items-center justify-center">
          <FontAwesomeIcon
            onClick={props.onButtonClick}
            // 選択したiconが切り替わる三項演算子で記述する props.isPlayがtrueの時とfalseの時
            icon={props.isPlay ? faStopCircle : faPlayCircle}
            // ${}でjavascriptが使える
            className={`text-white text-3xl mx-2 h-[40px] w-[40px] ${
              props.song.preview_url != null
                ? // preview_urlがある場合はcursor-pointerでボタンを押せるようになる
                  "cursor-pointer"
                : // preview_urlがない場合はopacity-50 pointer-events-noneでボタンが押せないようなcssの設定になる
                  "opacity-50 pointer-events-none"
            }`}
          />
        </div>
      </div>
    </footer>
  );
}
