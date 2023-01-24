import React, {
  useState,
  useRef,
  useEffect,
  memo,
  MutableRefObject,
} from "react";
import { Drawer } from "antd";
import classnames from "classnames";
import { BorderOutlined } from "@ant-design/icons";
import type { AudioInfo } from "../../models/AudioPlayer";
import { transformMIllionSecondsToTimeString } from "../../utils";
import styles from "./AudioListDrawer.module.less";

type AudioListDrawerParams = {
  handleSwitchTo(idx: number): void;
  audioList: AudioInfo[];
  currentPlayingIdx: number;
  drawerRef: MutableRefObject<() => void>;
};

function AudioListDrawer({
  handleSwitchTo,
  audioList,
  currentPlayingIdx,
  drawerRef,
}: AudioListDrawerParams) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const listWrapperRef = useRef(null);
  useEffect(() => {
    drawerRef.current = () => {
      setDrawerOpen(true);
    };
  }, []);
  return (
    <Drawer
      placement="right"
      onClose={() => {
        setDrawerOpen(false);
      }}
      headerStyle={{ display: "none" }}
      bodyStyle={{ backgroundColor: "var(--dark-base-color)", padding: 0 }}
      width={400}
      open={drawerOpen}
    >
      <div className={styles.wrapper}>
        <div className={styles.titleWrapper}>
          <BorderOutlined style={{ marginRight: 5 }} />
          播放列表
        </div>
        <div ref={listWrapperRef} className={styles.listWrapper}>
          {audioList.map((_, i) => (
            <div
              key={_.id}
              className={classnames(
                styles.itemWrapper,
                currentPlayingIdx === i && styles.isCurrentPlaying
              )}
              onDoubleClick={() => handleSwitchTo(i)}
            >
              {currentPlayingIdx === i && (
                <div className={styles.currentPlayingNoti}></div>
              )}
              <div className={styles.audioName}>{_.name}</div>
              <div className={styles.artists}>{_.artistInfo[0].name}</div>
              <div className={styles.duration}>
                {transformMIllionSecondsToTimeString(_.duration)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </Drawer>
  );
}


export default memo(AudioListDrawer)