import React, {
  useState,
  useRef,
  useEffect,
  memo,
  MutableRefObject,
  useCallback,
} from "react";
import { Drawer, Dropdown } from "antd";
import classnames from "classnames";
import { useDispatch } from "react-redux";
import {
  BorderOutlined,
  VerticalAlignTopOutlined,
  DeleteOutlined,
  DeleteFilled,
} from "@ant-design/icons";
import { updateOrderReducer, cleanAudioListReducer } from "@models/AudioPlayer";
import { transformMIllionSecondsToTimeString } from "@utils/index";
import styles from "./AudioListDrawer.module.less";

import type { DragEvent } from "react";
import type { AudioInfo } from "@models/AudioPlayer";
import type { MenuProps } from "antd";

type AudioListDrawerParams = {
  handleSwitchTo(idx: number): void;
  audioList: AudioInfo[];
  currentPlayingIdx: number;
  drawerRef: MutableRefObject<() => void>;
  isCurrentPlayingNone: boolean;
};

let currentDraggingIdx = -1;

function AudioListDrawer({
  handleSwitchTo,
  audioList,
  currentPlayingIdx,
  drawerRef,
  isCurrentPlayingNone,
}: AudioListDrawerParams) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const listWrapperRef = useRef(null);
  const dispatch = useDispatch();

  /**
   * 播放列表：调整音频位置
   */
  const handleUpdateOrder = useCallback((srcIdx: number, desIdx: number) => {
    if (srcIdx === desIdx) return;
    dispatch(updateOrderReducer({ srcIdx, desIdx }));
  }, []);
  /**
   * 清空播放列表
   */
  const handleCleanAudioList = useCallback(() => {
    dispatch(cleanAudioListReducer());
  }, []);
  // 删除歌单中的一项
  const handleDeleteOne = useCallback((idx: number) => {
    dispatch({
      type: "audioPlayer/deleteFromAudioListEffect",
      payload: {
        idx: idx,
      },
    });
  }, []);
  const handleDragOver = useCallback((e: DragEvent) => {
    e.preventDefault();
  }, []);
  const handleDragStart = useCallback((idx: number) => {
    currentDraggingIdx = idx;
  }, []);
  const handleDrop = useCallback((idx: number) => {
    window.eyeConsole(`${currentDraggingIdx} => ${idx}`);
    handleUpdateOrder(currentDraggingIdx, idx);
  }, []);

  useEffect(() => {
    drawerRef.current = () => {
      setDrawerOpen(true);
    };
  }, []);

  function genContextMenu(idx: number) {
    const contextItems: MenuProps["items"] = [
      {
        key: "1",
        icon: <VerticalAlignTopOutlined />,
        label: <span className={styles.contextMenuItem}>置顶</span>,
        onClick() {
          handleUpdateOrder(idx, 0);
        },
      },
      {
        key: "2",
        danger: true,
        icon: <DeleteOutlined />,
        label: <span className={styles.contextMenuItem}>删除</span>,
        onClick() {
          handleDeleteOne(idx);
        },
      },
    ];
    return contextItems;
  }

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
          <div>
            <BorderOutlined style={{ marginRight: 5 }} />
            播放列表
          </div>
          <div
            className={styles.cleanListButton}
            title="清空列表"
            onClick={handleCleanAudioList}
          >
            <DeleteFilled />
          </div>
        </div>
        <div ref={listWrapperRef} className={styles.listWrapper}>
          {audioList.map((_, i) => (
            <Dropdown
              key={_.id}
              menu={{ items: genContextMenu(i) }}
              trigger={["contextMenu"]}
              overlayClassName={styles.contextMenuWrapper}
            >
              <div
                className={classnames(
                  styles.itemWrapper,
                  currentPlayingIdx === i && styles.isCurrentPlaying
                )}
                onDoubleClick={() => handleSwitchTo(i)}
                draggable
                onDragStart={() => handleDragStart(i)}
                onDragOver={handleDragOver}
                onDropCapture={() => handleDrop(i)}
                data-idx={i}
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
            </Dropdown>
          ))}
        </div>
      </div>
    </Drawer>
  );
}

export default memo(AudioListDrawer);
