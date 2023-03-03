import React, {useRef} from "react";
import {createSlideObj} from "@/shared/utils/board-util";
import Board from "@/shared/components/board";

export default function Demo() {
    const row = 6;
    const col  = 40;
    const ref  =  useRef(null);
    const slideList =  [createSlideObj(row), createSlideObj(row),createSlideObj(row)]
    return (
        <>
            <div className="board-screen boarMainDiv">
            <div className="board p-l-r-32 custom-scroll">
            <Board
                ref={ref}
                slidesList={slideList}
                row={row}
                availableColors={[]}
                availableCharacters={['a','A']}
                selectedObj={slideList[0]}
                selectedIndex={0}
                spacialChar = {[]}
                emojiList={[]}
                blockColumns={[]}
                isUndoChange={true}
                handleCallBack={() => {}}
                handleCallbackForIntegration = {() => {}}
                isReadOnlyInputs={false}
                isShowBoardTitle={false}
                isHideTextArea={true}
                col={col}  />
            </div>
            </div>
        </>
    );
}
