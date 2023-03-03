import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import Draggable from 'react-draggable';
import {
    AnimationStyle, BoardGridSize,
    EmojiKeyIdPreFix,
    ERASE_EMOJI,
    FillColorKeyIdPrefix,
    InputColorColumnPrefix,
    InputColumnIdPrefix,
    TextAlign,
    TRANSPARENT,
} from '../../constant/constant';
import { convertStringtoArrForBoard } from '../../utils/board-util';
import { cloneDeep, remove, trim, trimEnd, trimStart } from 'lodash';
import classes from './board.module.scss';
import { Input } from 'antd';
import { IconEraser } from '../../icons/eraser';
import { useDispatch, useSelector } from 'react-redux';
import { WidgetCancelIcon } from '../../icons/widget-cancel';
import { hexToRgbA, secondsToTime } from '../../utils/util';
import notificaiton from '../notification/notificaiton';
import { TransformComponent, TransformWrapper } from 'react-zoom-pan-pinch';




const { TextArea: ANTTextArea } = Input;

interface FlipboardBoards {
    row: number;
    col: number;
    handleCallBack: any;
    availableCharacters: Array<any>;
    availableColors: Array<any>;
    refreshToken?: any;
    selectedIndex?: any;
    spacialChar?: any;
    handleCallbackForIntegration?: any;
    isHideTextArea?: boolean;
    isShowBoardTitle?: boolean;
    emojiList?:any;
    isReadOnlyInputs?:boolean;
    isUndoChange?:boolean;
    boardOverLay?: any;
    setAnimationRunnig? : any;
    isAnimationRunnig?: boolean;
    selectedObj: any;
    isEditMode?: boolean;
    blockColumns?: Array<any>
    isShowZoomBtns?: boolean;
    boardColorsConfig?: any;
    isShowDuration?: boolean;
    slidesList?: any;

}

const Board = (
    {
        row,
        col,
        handleCallBack,
        availableCharacters = [],
        availableColors = [],
        spacialChar = [],
        refreshToken,
        selectedIndex,
        handleCallbackForIntegration =  null,
        isHideTextArea =  false,
        isShowBoardTitle =  true,
        isReadOnlyInputs =  false,
        emojiList =  [],
        selectedObj = null,
        isUndoChange =  false,
        boardOverLay = null,
        setAnimationRunnig =  null,
        isAnimationRunnig =  false,
        blockColumns = [],
        isShowZoomBtns =  false,
        isShowDuration =  true,
        boardColorsConfig =  null,
        slidesList = []
    }: FlipboardBoards,
    forwardedRef: any,
) => {
    const validFunctionKey = [
        'Tab',
        'ArrowUp',
        'ArrowLeft',
        'ArrowRight',
        'ArrowDown',
        'Backspace',
        'Enter',
    ];
    const [value, setValue] = useState(selectedObj?.str);
    const [textAreaDisable, setTextAreaDisable] = useState(selectedObj?.isInlineEditMode);
    const [alignArr, setAlignArr] = useState(selectedObj?.alignRowValue);
    const [focusInputPostion, setFocusInputPostion] = useState<any>(null);
    const [isMouseDown, setMouseDown] = useState(false);
    const [selectedColor, setSelectedColor] = useState(availableColors[0]);
    const [isTextMode, setTextMode] = useState(true);
    const [isColorMode, setColorMode] = useState(false);
    const [isWidgetMode, setWidgetMode] = useState(false);
    const [boardColorPath, setBoardColorPath] = useState([]);
    const [integration, setIntegration] = useState(selectedObj?.integrations);
    const [isEmojiMode, setEmojiMode] = useState(false);
    const [isInit, setInit] = useState(false);
    const [selectedEmoji, setSelectedEmoji] = useState(emojiList.length ?  emojiList[0] : null);
    const refs = useRef<(HTMLDivElement | null)[][]>([]);
    const [boardFrameColor, setBoardFrameColor] =  useState(boardColorsConfig && boardColorsConfig?.frameColor ? {
        background: boardColorsConfig?.frameColor,
    } : null ); // set background color only
    const [boardFlapModuleColor, setBoardFlapModuleColor] = useState(boardColorsConfig && boardColorsConfig?.flapModule ? {
        background: boardColorsConfig?.flapModule,
        borderTop: '1px solid rgba(255, 0, 0, 0.5)',
        borderRight: '1px solid rgba(255, 0, 0, 0.5)',
    } : null); // set background color only
    const [boardFlapBackgroundColor, setBoardFlapBackgroundColor] = useState(
        boardColorsConfig && boardColorsConfig?.flapBackGroundColor ? {
            background: boardColorsConfig?.flapBackGroundColor,
            border: `1px solid ${boardColorsConfig?.flapBackGroundColor}`,
        } : null); // set background color  and border 1px
    const [boardFlapTextColor, setBoardFlapTextColor] = useState(boardColorsConfig && boardColorsConfig?.flapTextColor ? {
        color: boardColorsConfig?.flapTextColor,
    } : null);// set text color
    // const dispatch =  useDispatch();



    const getCursorLoc = () => {
        // Get the location of the box that should be in focus based on cursor position
        // @ts-ignore
        let text = document.getElementById('mainTextArea').value;

        let cursorIndices = [
            // @ts-ignore
            document.getElementById('mainTextArea').selectionStart,
            // @ts-ignore
            document.getElementById('mainTextArea').selectionEnd,
        ];

        let indices = [];
        for (let cursorIndex of cursorIndices) {
            let preText = text.slice(0, cursorIndex);
            let preLines = preText.split('\n');
            let lineIndex = preLines.length - 1;
            let innerIndex = preLines[lineIndex].length;
            indices.push(lineIndex);
            indices.push(innerIndex);
        }

        return indices;
    };
    const isElementExist = (id: any) => {
        return !!document.getElementById(id);
    };
    const isValidChar = (char: any) => {
        const valid = availableCharacters;
        const notValid: any = [];
        let isValid = true;
        valid.map((ele) => {
            notValid.push(String(ele).charCodeAt(0));
            notValid.push(String(ele).toLowerCase().charCodeAt(0));
        });



        if (char.length === 1) {
            if (!notValid.includes(char.charCodeAt(0))) {
                isValid = false;
            }
        } else {
            isValid = validFunctionKey.includes(char);
        }
        return isValid;
    };
    const setTextInputValue = ({ rowI, colI, val = '', isAnimation =  false }: any) => {
        // @ts-ignore
        const input: any =  refs.current[rowI][colI];
        // )  as HTMLInputElement;
        if (val !== '' && isAnimation) {
            const interVal =  setInterval( () => {
                const string  = 'ASDFGHJKL:LKJHGFDFGHJKLOPI&^%$#$%^&*()_)(*&^%$ERFGHJKLKJHGFDFGHJKLOIUYTRTYUI';
                const rendomChar = Math.floor(Math.random() * string.length);
                input.value =  string.charAt(rendomChar);
            }, 100);
            setTimeout(() => {
                clearInterval(interVal);
                input.value =  val;
            }, 1000);



        } else {
            input.value =  val;
        }



    };
    const setTextInputValueForAnimation = ({ rowI, colI, val = '' }: any) => {
        // @ts-ignore
        // let x: any = document.getElementById('flapAudio');
        // x.playbackRate = 0.5;
        const input: any =  refs.current[rowI][colI];


        const interVal =  setInterval( () => {
            const string  =  availableCharacters && availableCharacters.length > 10 ?  availableCharacters.join('') :  'ASDFGHJKL:LKJHGFDFGHJKLOPI&^%$#$%^&*()_)(*&^%$ERFGHJKLKJHGFDFGHJKLOIUYTRTYUI';
            const randomChar = Math.floor(Math.random() * string.length);
            input.value =  string.charAt(randomChar);
            // x.play();
        }, 100);


        setTimeout(() => {
            clearInterval(interVal);
            input.value =  val;
            const { animationSetting: { animationStyle } } = selectedObj;
            if (animationStyle === AnimationStyle.LEFT_TO_RIGHT) {
                if (colI === (col - 1)) {
                    setAnimationRunnig(false);
                }

            }
            if (animationStyle ===  AnimationStyle.RIGHT_TO_LEFT) {
                if (colI === 0) {
                    setAnimationRunnig(false);
                }

            }
        }, 3000);



    };
    const setTextInputValueSelect = ({ rowI, colI }: any) => {
        if (isElementExist(`${InputColumnIdPrefix}-row-${rowI}-col-${colI}`)) {
            // @ts-ignore
            const input: any =  refs.current[rowI][colI];
            input.select();
        }
    };
    const setTextInputFocus = ({ rowI, colI }: any) => {
        if (isElementExist(`${InputColumnIdPrefix}-row-${rowI}-col-${colI}`)) {
            // @ts-ignore
            const input: any =  refs.current[rowI][colI];
            input?.focus();
        }
    };
    const getTextInputValue = ({ rowI, colI, val = '' }: any) => {
        // @ts-ignore
        const input: any = refs.current[rowI][colI];
        return input?.value || val;
    };
    const getBoardString = () => {
        let arrIndex = 0;
        const strArr = [];
        for (let rowI = 0; rowI < row; rowI++) {
            let str;
            for (let colI = 0; colI < col; colI++) {
                if (str) {
                    str = str + getTextInputValue({ rowI: rowI, colI: colI, val: ' ' });
                } else {
                    str = getTextInputValue({ rowI: rowI, colI: colI, val: ' ' });
                }
            }
            strArr[arrIndex] = str;
            arrIndex++;
        }
        return strArr.join('');
    };
    // print board
    const printBoardLeftAlign = ({ strArr, rowIndex, index }: any) => {
        for (let colI = 0; colI < col; colI++) {
            if (
                isElementExist(`${InputColumnIdPrefix}-row-${rowIndex}-col-${colI}`)
            ) {
                if (strArr[index]) {
                    setTextInputValue({
                        rowI: rowIndex,
                        colI: colI,
                        val: strArr[index].charAt(colI),
                    });
                }
            }
        }
    };
    const printBoardRightAlign = ({ strArr, rowIndex, index }: any) => {
        if (strArr[index]?.length) {
            let startPoint = col - (strArr[index].length - 1) - 1;
            let stringIncrementCounter = 0;
            for (let colI = startPoint; colI < col; colI++) {
                if (
                    isElementExist(`${InputColumnIdPrefix}-row-${rowIndex}-col-${colI}`)
                ) {
                    setTextInputValue({
                        rowI: rowIndex,
                        colI: colI,
                        val: strArr[index].charAt(stringIncrementCounter),
                    });
                    stringIncrementCounter++;
                }
            }
        }
    };
    const printBoardCentertAlign = ({ strArr, rowIndex, index }: any) => {
        if (strArr[index]) {
            let startPoint = col / 2 - Math.floor(strArr[index]?.length / 2);
            let stringInc = 0;
            for (let colI = 0; colI < col; colI++) {
                if (
                    isElementExist(
                        `${InputColumnIdPrefix}-row-${rowIndex}-col-${startPoint}`,
                    )
                ) {
                    if (strArr[index]) {
                        setTextInputValue({
                            rowI: rowIndex,
                            colI: startPoint,
                            val: strArr[index].charAt(stringInc),
                        });
                        startPoint++;
                        stringInc++;
                    }
                }
            }
        }
    };
    // when pass string arr then not create string to string array
    // string array pass when align board
    // eslint-disable-next-line @typescript-eslint/default-param-last
    const printBoard = (str: any, stringArr = null, alignmentArr) => {
        let strArr = stringArr ?  stringArr : convertStringtoArrForBoard(str, col, row);
        let stringPosIndex = 0;
        for (
            let rowIndex =
                Math.round(alignmentArr.length / 2) - Math.round(strArr.length / 2);
            rowIndex < alignmentArr.length;
            rowIndex++
        ) {
            if (alignmentArr[rowIndex] === TextAlign.LEFT) {
                printBoardLeftAlign({
                    strArr,
                    rowIndex: rowIndex,
                    index: stringPosIndex,
                });
            }
            if (alignmentArr[rowIndex] === TextAlign.RIGHT) {
                printBoardRightAlign({
                    strArr,
                    rowIndex: rowIndex,
                    index: stringPosIndex,
                });
            }

            if (alignmentArr[rowIndex] === TextAlign.CENTER) {
                printBoardCentertAlign({
                    strArr,
                    rowIndex: rowIndex,
                    index: stringPosIndex,
                });
            }
            stringPosIndex++;
        }
        // alignArr.forEach((alignValue: any, alignArrIndex: number) => {
        //   if (alignValue === TextAlign.LEFT) {
        //     printBoardLeftAlign({ strArr, index:alignArrIndex });
        //   }
        //   if (alignValue === TextAlign.RIGHT) {
        //     printBoardRightAlign({ strArr, index:alignArrIndex });
        //   }
        //
        //   if (alignValue === TextAlign.CENTER) {
        //     printBoardCentertAlign({ strArr, index:alignArrIndex });
        //   }
        // });
    };
    const createArrayBoarValue = ({ colorPath =  selectedObj.colorPath }) => {
        const screenSet = [];
        alignArr.map((val, rowIndex) => {
            const rowData = [];
            for (let column = 0; column < col; column++) {
                const columnValue = getTextInputValue({
                    rowI: rowIndex,
                    colI: column,
                    val: null,
                });
                const colorPathValue = colorPath.find(
                    ({ key }) =>
                        key === `${FillColorKeyIdPrefix}-row-${rowIndex}-col-${column}`,
                );
                const findEmoji = selectedObj.emojiPath.find(
                    ({ key }) => key === `${EmojiKeyIdPreFix}-row-${rowIndex}-col-${column}`,
                );
                const blockColumn =  blockColumns.includes(column);
                if (blockColumn) {
                    const columnObj = {
                        type: 0,
                    };
                    rowData.push(columnObj);
                } else if (colorPathValue) {
                    const columnObj = {
                        type: 2,
                        hex_code: colorPathValue?.color,
                    };
                    rowData.push(columnObj);
                } else if (findEmoji) {
                    const columnObj = {
                        type: 3,
                        filename: findEmoji?.name,
                    };
                    rowData.push(columnObj);

                } else if (columnValue?.trim()) {
                    const columnObj = {
                        type: 1,
                        char: columnValue.toUpperCase(),
                    };
                    rowData.push(columnObj);
                } else {
                    const columnObj = {
                        type: 0,
                    };
                    rowData.push(columnObj);
                }
            }
            screenSet.push(rowData);
        });

        return screenSet;
    };
    const resetInput = () => {
        for (let rowI = 0; rowI < row; rowI++) {
            for (let colI = 0; colI < col; colI++) {
                if (isElementExist(`${InputColumnIdPrefix}-row-${rowI}-col-${colI}`)) {
                    setTextInputValue({ rowI: rowI, colI: colI, val: '' });
                }
                // document.getElementById(`${FillColorKeyIdPrefix}-row-${rowI}-col-${colI}`);
            }
        }
    };
    const setBoardValue = (str: any) => {
        //reset all inout
        resetInput();
        printBoard(str, null, selectedObj?.alignRowValue);
        setTimeout(() => {
            if (handleCallBack && !isInit) {
                handleCallBack({
                    string: str,
                    align: alignArr,
                    isInlineEditMode: textAreaDisable,
                    stringArray: createArrayBoarValue({}),
                });
            }
        }, 20);
    };
    const handleRestrictedChar = (event: any) => {
        if (!isValidChar(event.key)) {
            event.preventDefault();
        }
    };
    // textarea event
    const onChnageForTextArea = (e: any) => {
        setValue(e.target.value);
        setFocusInputPostion(null);
    };
    const onMouseUpForTextArea = () => {};
    const onKeyChangeForTextArea = (event: any) => {
        const getPos = getCursorLoc();
        handleRestrictedChar(event);
        if (event.key === 'Enter' && getPos[0] === row - 1) {
            event.preventDefault();
        }
        if (event.target.value.length === row * col) {
            event.preventDefault();
        }
        if (event.key === 'Enter') {
            let stopNewLine = false;
            for (let i = 0; i < col; i++) {
                if (getTextInputValue({ rowI: row - 1, colI: i }) &&
                    getTextInputValue({ rowI: 0, colI: i })) {
                    stopNewLine = true;
                }
            }
            if (stopNewLine) {
                event.preventDefault();
            }
        }
    };
    const getBoardValue = (isTrimString =  false) => {
        const strArr = [];
        let arrIndex = 0;

        for (let rowI = 0; rowI < row; rowI++) {
            let str;
            for (let colI = 0; colI < col; colI++) {
                if (str) {
                    str = str + getTextInputValue({ rowI: rowI, colI: colI, val: ' ' });
                } else {
                    str = getTextInputValue({ rowI: rowI, colI: colI, val: ' ' });
                }
            }
            if (focusInputPostion !== null) {
                if (str.trim() !== '' && isTrimString && rowI === focusInputPostion?.rowIndex) {
                    str = trimStart(str);
                    str = trimEnd(str);

                }

            }  else {
                if (str.trim() !== '' && isTrimString) {
                    str = trimStart(str);
                    str = trimEnd(str);

                }
            }

            strArr[arrIndex] = str;
            arrIndex++;
        }
        return strArr;
    };
    const onChangeAlignmentBoard = (arr) => {
        if (!isUndoChange) {
            const beforeStrArr = getBoardValue(true);
            resetInput();
            setTimeout(() => {
                printBoard('', beforeStrArr, arr);
            }, 10);
            setTimeout(() => {
                const afterStrArr = getBoardValue();
                if (handleCallBack && !isInit) {
                    handleCallBack({
                        string: afterStrArr.join(''),
                        align: arr,
                        isInlineEditMode: textAreaDisable,
                        stringArray: createArrayBoarValue({}),
                    });
                }
            }, 100);


        }

    };
    // Input Events
    const handleInputChange = ({ rowIndex, colIndex, value:myVal }) => {
        setTextInputValue({ rowI: rowIndex, colI: colIndex, val: myVal });
        setTimeout(() => {
            const str = getBoardString();
            if (handleCallBack && !isInit) {
                handleCallBack({
                    string: str,
                    align: alignArr,
                    isInlineEditMode: textAreaDisable,
                    stringArray: createArrayBoarValue({}),
                });
            }
        }, 100);

    };
    const handleInputKeyUp = ({ event, rowIndex, colIndex }: any) => {
        const ctrl = event.ctrlKey ? event.ctrlKey : ((event.keyCode === 17) ? true : false);
        if (event.keyCode == 86 && ctrl) {
            event.preventDefault();
            notificaiton.warn('You can’t paste content inside the board');
            return;
        }
        if (event.keyCode === 17) {
            event.preventDefault();
            return;
        }
        if (isValidChar(event.key)) {
            if (event.keyCode === 40) {
                rowIndex++;
                colIndex--;
                if (rowIndex < row) {
                    setTextInputFocus({ rowI: rowIndex, colI: colIndex });
                    setTextInputValueSelect({ rowI: rowIndex, colI: colIndex });
                }
            }

            if (event.keyCode === 38) {
                rowIndex--;
                colIndex--;
            }

            if (event.keyCode === 8 || event.keyCode === 37) {
                if (event.keyCode !== 37) {
                    handleInputChange({ rowIndex, colIndex, value:  '' });
                }
                colIndex--;
                if (blockColumns.includes(colIndex)) {
                    colIndex--;
                }
                if (colIndex < 0) {
                    rowIndex--;
                    setTextInputFocus({ rowI: rowIndex, colI: col - 1 });
                    setTextInputValueSelect({ rowI: rowIndex, colI: col - 1 });
                } else {
                    setTextInputFocus({ rowI: rowIndex, colI: colIndex });
                    setTextInputValueSelect({ rowI: rowIndex, colI: colIndex });
                }
            } else if (event.keyCode === 13) {
                // for enter
                rowIndex++;
                colIndex = 0;
                if (blockColumns.includes(colIndex)) {
                    colIndex++;
                }
                if (rowIndex < row) {
                    setTextInputFocus({ rowI: rowIndex, colI: colIndex });
                    setTextInputValueSelect({ rowI: rowIndex, colI: colIndex });
                }
            } else {
                // tab key is allow but not inc colIndex tab default functionality
                if (event.key !== 'Tab') {
                    // arrow key code not found then print txt
                    if (event.keyCode !== 39 && event.keyCode !== 40 && event.keyCode !== 38) {
                        console.log(event.key);
                        handleInputChange({ rowIndex, colIndex, value: event.key });
                    }
                    colIndex++;
                    if (blockColumns.includes(colIndex)) {
                        colIndex++;
                    }
                }
                if (colIndex === col) {
                    rowIndex++;
                    colIndex = 0;
                    if (blockColumns.includes(colIndex)) {
                        colIndex++;
                    }
                    setTextInputFocus({ rowI: rowIndex, colI: colIndex });
                    setTextInputValueSelect({ rowI: rowIndex, colI: colIndex });
                } else {
                    setTextInputFocus({ rowI: rowIndex, colI: colIndex });
                    setTextInputValueSelect({ rowI: rowIndex, colI: colIndex });
                }
            }
        }
    };

    // board events
    const setAlignBoardValue = (textAlignValue: any) => {
        if (isAnimationRunnig) {
            return;
        }
        let alignArrClone = cloneDeep(alignArr);
        if (focusInputPostion) {
            alignArrClone[focusInputPostion.rowIndex] = textAlignValue;
            setAlignArr([...alignArrClone]);
            onChangeAlignmentBoard(alignArrClone);
        } else {
            for (let rowI = 0; rowI < row; rowI++) {
                alignArrClone[rowI] = textAlignValue;
            }
            setAlignArr([...alignArrClone]);
            onChangeAlignmentBoard(alignArrClone);

        }
    };
    const resetColorPath = () => {
        for (let rowI = 0; rowI < row; rowI++) {
            for (let colI = 0; colI < col; colI++) {
                if (
                    isElementExist(`${InputColorColumnPrefix}-row-${rowI}-col-${colI}`)
                ) {
                    // @ts-ignore
                    document.getElementById(
                        `${InputColorColumnPrefix}-row-${rowI}-col-${colI}`,
                    ).style.backgroundColor = TRANSPARENT;
                }
            }
        }
    };

    const onDoubleClickOnColorMode = (dblcolor: string) => {
        const str = getBoardString();
        const emojiPathArr = selectedObj?.emojiPath;
        setSelectedColor(dblcolor);
        const obj = [];
        if (dblcolor === TRANSPARENT) {
            setBoardColorPath([...obj]);
        } else {
            for (let rowI = 0; rowI < row; rowI++) {
                for (let colI = 0; colI < col; colI++) {
                    const colorPathObj = {
                        key: `${FillColorKeyIdPrefix}-row-${rowI}-col-${colI}`,
                        row :rowI,
                        col :colI,
                        color: dblcolor,
                    };
                    obj.push(colorPathObj);
                }
            }
            setBoardColorPath([...obj]);
        }

        if (handleCallBack && !isInit) {
            handleCallBack({
                stringArray: createArrayBoarValue({}),
                string: str,
                align: selectedObj?.alignRowValue,
                emojiPath: emojiPathArr,
                isInlineEditMode: textAreaDisable,
                colorPath: obj,
            });
        }
    };
    const renderColorPath = () => {
        const str = getBoardString();
        resetColorPath();

        if (boardColorPath.length) {
            // eslint-disable-next-line @typescript-eslint/no-shadow
            boardColorPath.map(({ row, col, color }: any) => {
                // @ts-ignore
                document.getElementById(
                    `${InputColorColumnPrefix}-row-${row}-col-${col}`,
                ).style.backgroundColor = color;
            });
        }

        if (handleCallBack && !isInit) {
            handleCallBack({
                string: str,
                align: selectedObj?.alignRowValue,
                isInlineEditMode: textAreaDisable,
                colorPath: boardColorPath,
                stringArray: createArrayBoarValue({ colorPath:  boardColorPath }),
            });
        }
    };
    // eslint-disable-next-line @typescript-eslint/no-shadow
    const setColorPath = ({ row, col }: any) => {
        const str = getBoardString();
        const emojiPathArr = selectedObj?.emojiPath;
        const findIndexForColorPathIndex = boardColorPath.findIndex(
            ({ key }: any) => key === `${FillColorKeyIdPrefix}-row-${row}-col-${col}`,
        );

        if (findIndexForColorPathIndex >= 0) {
            const boardColorPathClone = cloneDeep(boardColorPath);
            if (selectedColor === TRANSPARENT) {
                boardColorPathClone.splice(findIndexForColorPathIndex, 1);
                setBoardColorPath([...boardColorPathClone]);

            } else {
                if (boardColorPathClone[findIndexForColorPathIndex].color !== selectedColor) {
                    boardColorPathClone[findIndexForColorPathIndex].color = selectedColor;
                    setBoardColorPath([...boardColorPathClone]);
                }

            }
        } else {
            if (selectedColor !== TRANSPARENT) {
                const boardColorPathClone = cloneDeep(boardColorPath);
                const colorPathObj = {
                    key: `${FillColorKeyIdPrefix}-row-${row}-col-${col}`,
                    row,
                    col,
                    color: selectedColor,
                };
                boardColorPathClone.push(colorPathObj);
                setBoardColorPath([...boardColorPathClone]);
            }
        }
        if (handleCallBack && !isInit) {
            handleCallBack({
                string: str,
                align: alignArr,
                isInlineEditMode: textAreaDisable,
                emojiPath: emojiPathArr,
                stringArray: createArrayBoarValue({}),
            });
        }
    };
    const setTextBoard = () => {
        if (isAnimationRunnig) {
            return;
        }
        setTextMode(true);
        setColorMode(false);
        setEmojiMode(false);
        setWidgetMode(false);
    };
    const setColorBoard = () => {
        if (isAnimationRunnig) {
            return;
        }
        setTextMode(false);
        setColorMode(true);
        setEmojiMode(false);
        setWidgetMode(false);
    };
    const setEmojiBoard = () => {
        if (isAnimationRunnig) {
            return;
        }
        setTextMode(false);
        setColorMode(false);
        setEmojiMode(true);
        setWidgetMode(false);

    };


    const setBoardWidgetMode = () => {
        if (isAnimationRunnig) {
            return;
        }
        setTextMode(false);
        setColorMode(false);
        setEmojiMode(false);
        setWidgetMode(true);
    };
    const onPaste = (event: any) => {
        event.preventDefault();
        notificaiton.warn('You can’t paste content inside the board');
        // const valid = availableCharacters;
        // const notValid: any = [];
        // valid.map((ele) => {
        //   notValid.push(String(ele).charCodeAt(0));
        //   notValid.push(String(ele).toLowerCase().charCodeAt(0));
        // });
        // const pasteText = event.clipboardData.getData('text/plain');

        // for (let i = 0; i < pasteText.length; i++) {
        //   if (!notValid.includes(pasteText.charCodeAt(i))) {
        //     event.preventDefault();
        //   }
        // }
    };
    const parseStringForTextArea  = () => {
        const stringArr: any = convertStringtoArrForBoard(selectedObj?.str, col, row);
        let  str = '';
        if (stringArr && stringArr.length) {
            stringArr.map((val) => {
                let string = val;
                string = trimStart(string);
                string = trimEnd(string);
                if (string === '') {
                    str  = str + string;

                } else {
                    str  = str + string + '\n';

                }
            });

        }

        return str;
    };
    const resetBoard = () => {
        if (isAnimationRunnig) {
            return;
        }
        resetInput();
        resetColorPath();
        setValue('');
        setTextMode(true);
        setColorMode(false);
        setEmojiMode(false);
        setWidgetMode(false);
        setTextAreaDisable(false);
        setBoardColorPath([]);
        // @ts-ignore
        const alignArray = [...Array(row).keys()].map(() => TextAlign.CENTER);
        setAlignArr(alignArray);
        if (handleCallBack) {
            handleCallBack({
                string: '',
                align: alignArray,
                isInlineEditMode: false,
                colorPath: [],
                stringArray: createArrayBoarValue({}),
                emojiPath:[],
            });
        }
    };
    // eslint-disable-next-line @typescript-eslint/no-shadow
    const renderEmoji = ({ row, col }: any) => {
        // for remove issue emoji path then emoji path array get from slidelist
        const findEmoji = slidesList[selectedIndex]?.emojiPath.find(
            (slide: any) => row === slide.row && col === slide.col,
        );
        const colorPath = selectedObj.colorPath.find(
            (slide: any) => row === slide.row && col === slide.col,
        );
        if (findEmoji && !colorPath) {
            return <img src={`${findEmoji.src}`} className={'emoji'}/>;
        }
        return <></>;
    };
    // eslint-disable-next-line @typescript-eslint/no-shadow
    const addEmojiInInput = ({ row, col }: any) => {
        const str = getBoardString();
        // const emojiPathArr = selectedObj?.emojiPath;
        const emojiPathArr =  slidesList[selectedIndex].emojiPath;
        const isEmojiPathAlreadyExist = emojiPathArr.findIndex(
            (emojiItem: any) => emojiItem.row === row && emojiItem.col === col,
        );
        if (selectedEmoji === ERASE_EMOJI) {
            if (isEmojiPathAlreadyExist >= 0) {
                emojiPathArr.splice(isEmojiPathAlreadyExist, 1);
            }
        } else {
            if (isEmojiPathAlreadyExist < 0) {
                emojiPathArr.push({
                    key: `${EmojiKeyIdPreFix}-row-${row}-col-${col}`,
                    row: row,
                    col: col,
                    src: selectedEmoji.image,
                    name: selectedEmoji.name,
                });
            }
        }

        if (isEmojiMode) {
            if (handleCallBack && !isInit) {
                handleCallBack({
                    string: str,
                    align: alignArr,
                    isInlineEditMode: textAreaDisable,
                    emojiPath: emojiPathArr,
                    stringArray: createArrayBoarValue({}),
                });
            }
        }
    };
    const  handleDrag = (e, ui, widgetId) => {
        if (handleCallbackForIntegration) {
            handleCallbackForIntegration({ x: ui.x, y: ui.y, widgetId, slideObj: selectedObj });
        }
    };
    const rightToLeftAnimation = () => {
        if (setAnimationRunnig) {
            setAnimationRunnig(true);

        }
        const valueArr = [];
        for (let r = 0 ;r < row;r++) {
            for (let c = 0 ;c < col;c++) {
                const colVal =  getTextInputValue({ rowI:r, colI: c });
                if (colVal  !== '') {
                    valueArr.push({
                        key: `colVal-row${r}-${c}`,
                        value: colVal,
                    });
                }
            }
        }
        let colIndex =  (col - 1);
        const myvar =   setInterval(() =>{
            if (colIndex >= 0) {
                for (let j  = 0; j < row; j++ ) {
                    // eslint-disable-next-line @typescript-eslint/no-loop-func
                    const findValue  =  valueArr.find(({ key }) => key === `colVal-row${j}-${colIndex}`);
                    setTextInputValueForAnimation({ rowI: j, colI: colIndex, val: findValue ? findValue.value : ''  });
                }
                colIndex--;
            } else {
                clearInterval(myvar);


            }
        }, 50);
    };
    const leftToRightAnimation = () => {
        if (setAnimationRunnig) {
            setAnimationRunnig(true);
        }

        const valueArr = [];
        for (let r = 0 ;r < row;r++) {
            for (let c = 0 ;c < col;c++) {
                const colVal =  getTextInputValue({ rowI:r, colI: c });
                if (colVal  !== '') {
                    valueArr.push({
                        key: `colVal-row${r}-${c}`,
                        value: colVal,
                    });
                }
            }
        }


        let colIndex =  0;

        const myvar =   setInterval(() =>{
            if (colIndex < col) {
                for (let j  = 0; j < row; j++ ) {
                    // eslint-disable-next-line @typescript-eslint/no-loop-func
                    const findValue  =  valueArr.find(({ key }) => key === `colVal-row${j}-${colIndex}`);
                    setTextInputValueForAnimation({ rowI: j, colI: colIndex, val: findValue ?  findValue.value : '' });
                }
                colIndex++;
            } else {
                clearInterval(myvar);
            }
        }, 50);

        // setTimeout(() => {
        //   if (setAnimationRunnig) {
        //     setAnimationRunnig(false);
        //   }
        // },100)

    };
    const upToDownAnimation = () => {
        if (setAnimationRunnig) {
            setAnimationRunnig(true);

        }

        const valueArr = [];
        for (let r = 0 ;r < row;r++) {
            for (let c = 0 ;c < col;c++) {
                const colVal =  getTextInputValue({ rowI:r, colI: c });
                if (colVal  !== '') {
                    valueArr.push({
                        key: `colVal-row${r}-${c}`,
                        value: colVal,
                    });
                }
            }
        }
        let rowIndex =  0;
        const myvar =   setInterval(() =>{
            if (rowIndex <  row) {
                for (let j  = 0; j < col; j++ ) {
                    // eslint-disable-next-line @typescript-eslint/no-loop-func
                    const findValue  =  valueArr.find(({ key }) => key === `colVal-row${rowIndex}-${j}`);
                    setTextInputValueForAnimation({ rowI: rowIndex, colI: j, val:  findValue ?  findValue.value : '' });
                }
                rowIndex++;
            } else {
                clearInterval(myvar);
                if (setAnimationRunnig) {
                    setAnimationRunnig(false);

                }

            }
        }, 50);

    };
    const downToUpAnimation = () => {
        if (setAnimationRunnig) {
            setAnimationRunnig(true);

        }

        const valueArr = [];
        for (let r = 0 ;r < row;r++) {
            for (let c = 0 ;c < col;c++) {
                const colVal =  getTextInputValue({ rowI:r, colI: c });
                if (colVal  !== '') {
                    valueArr.push({
                        key: `colVal-row${r}-${c}`,
                        value: colVal,
                    });
                }
            }
        }
        let rowIndex =  row - 1;
        const myvar =   setInterval(() =>{
            if (rowIndex >= 0) {
                for (let j  = 0; j < col; j++ ) {
                    // eslint-disable-next-line @typescript-eslint/no-loop-func
                    const findValue  =  valueArr.find(({ key }) => key === `colVal-row${rowIndex}-${j}`);
                    setTextInputValueForAnimation({ rowI: rowIndex, colI: j, val:  findValue ?  findValue.value : '' });
                }
                rowIndex--;
            } else {
                clearInterval(myvar);
                if (setAnimationRunnig) {
                    setAnimationRunnig(false);
                }

            }
        }, 50);




    };
    const snackAnimation = () => {
        if (setAnimationRunnig) {
            setAnimationRunnig(true);

        }

        let colI =  0;
        let rowI = 0;
        let flag  = false;
        const valueArr = [];
        for (let r = 0 ;r < row;r++) {
            for (let c = 0 ;c < col;c++) {
                const colVal =  getTextInputValue({ rowI:r, colI: c });
                if (colVal  !== '') {
                    valueArr.push({
                        key: `colVal-row${r}-${c}`,
                        value: colVal,
                        rowindex: r,
                        colindex: c,
                    });
                }
            }
        }

        setInterval(() =>{
            if (rowI < row) {
                // let x: any = document.getElementById('flapAudio');
                // x.playbackRate = 0.5;
                const input: any = refs.current[rowI][colI];
                setInterval(() => {
                    const string = 'ASDFGHJKL:LKJHGFDFGHJKLOPI&^%$#$%^&*()_)(*&^%$ERFGHJKLKJHGFDFGHJKLOIUYTRTYUI';
                    const rendomStr = Math.floor(Math.random() * string.length);
                    input.value = string.charAt(rendomStr);
                    // x.play();
                }, 10);

                if (flag) {
                    if (colI <= 0) {
                        colI = 0;
                        if (rowI < row) {
                            rowI++;
                        }
                        flag = false;
                    } else {
                        colI--;
                    }
                } else {
                    if (colI === (col - 1)) {
                        colI = col - 1;
                        flag = true;
                        if (rowI < row) {
                            rowI++;
                        }

                    } else {
                        colI++;
                    }
                }
            } else {
                setTimeout(() =>{
                    // eslint-disable-next-line @typescript-eslint/naming-convention
                    const interval_id = window.setInterval(function () {}, Number.MAX_SAFE_INTEGER);
                    for (let i = 1; i < interval_id; i++) {
                        window.clearInterval(i);
                    }

                    for (let r = 0 ;r < row;r++) {
                        for (let c = 0 ;c < col;c++) {
                            const input: any = refs.current[r][c];
                            const findValue  =  valueArr.find(({ key }) => key === `colVal-row${r}-${c}`);
                            input.value = findValue ?  findValue.value : '';
                        }
                    }
                    if (setAnimationRunnig) {
                        setAnimationRunnig(false);

                    }

                }, 100);
            }


        }, 5);


    };
    const getDynamicWidthForWidget = (widgetCol) => {
        return Math.ceil(widgetCol * 33);
    };
    const playAnimation =  ()  => {
        const { animationSetting: { animationStyle } } = selectedObj;
        if (animationStyle === AnimationStyle.LEFT_TO_RIGHT) {
            leftToRightAnimation();
        }
        if (animationStyle === AnimationStyle.RIGHT_TO_LEFT) {
            rightToLeftAnimation();
        }
    };
    const handleInputClick = ({ rowIndex, colIndex }: any) => {
        if (isAnimationRunnig) {
            return;
        }
        if (isTextMode) {
            setTextInputValueSelect({ rowI: rowIndex, colI: colIndex });
            setTextAreaDisable(true);
        }
        if (isColorMode) {
            setColorPath({
                row: rowIndex,
                col: colIndex,
            });
        }
    };
    const autoTextFormatIng = () =>  {
        if (!isUndoChange) {
            const beforeStrArr = getBoardValue(true);
            const trimArr = [];
            beforeStrArr.map((arr) => {
                const trimValue = trim(arr);
                if (trimValue !== '') {
                    trimArr.push(trimValue.replace(/  +/g, ' '));

                }
            });
            const alignArray = [...Array.from(Array(row).keys())].map(() => TextAlign.CENTER);
            resetInput();
            setTimeout(() => {
                printBoard('', trimArr, alignArray);
            }, 10);
            setFocusInputPostion(null);
            setTimeout(() => {
                const afterStrArr = getBoardValue();
                if (handleCallBack && !isInit) {
                    handleCallBack({
                        string: afterStrArr.join(''),
                        align: alignArray,
                        isInlineEditMode: textAreaDisable,
                        stringArray: createArrayBoarValue({}),
                    });
                }
            }, 100);


        }

    };

    const boardZoomIn = () => {
        const element =   document.getElementById('zoomInBtn');
        if (element) {
            element.click();
        }
    };
    const boardZoomOut = () => {
        const element =   document.getElementById('zoomOutBtn');
        if (element) {
            element.click();
        }
    };
    const boardZoomReset = () => {
        const element =   document.getElementById('zoomReset');
        if (element) {
            element.click();
        }
    };

    const removeIntegration = (widgetId) => {
        // let slideListCloneArr =  cloneDeep(slidesList);
        // let integrationArr = cloneDeep(slideListCloneArr[selectedIndex]?.integrations);
        // remove(integrationArr, (app: any) => {
        //     return app?.widgetId === widgetId;
        // });
        // slideListCloneArr[selectedIndex].integrations =  integrationArr;
        // dispatch(setSlideList([...slideListCloneArr]));
    };

    useImperativeHandle(forwardedRef, () => ({
        setAlignBoardValue,
        setTextBoard,
        setColorBoard,
        setEmojiBoard,
        resetBoard,
        rightToLeftAnimation,
        leftToRightAnimation,
        upToDownAnimation,
        downToUpAnimation,
        snackAnimation,
        playAnimation,
        autoTextFormatIng,
        boardZoomIn,
        boardZoomOut,
        boardZoomReset,
        setBoardWidgetMode,
    }));

    useEffect(() => {
        setBoardValue(value);

    }, [value]);

    useEffect(() => {
        resetInput();
        if (!selectedObj?.isInlineEditMode) {
            setValue(parseStringForTextArea());
            setTimeout(() => {
                onChangeAlignmentBoard(selectedObj?.alignRowValue);
            }, 20);
        } else {
            setValue(selectedObj?.str);
        }
        setBoardValue(selectedObj?.str);

        setAlignArr([...selectedObj?.alignRowValue]);
        setBoardColorPath([...selectedObj?.colorPath]);
        setColorMode(false);
        setTextAreaDisable(selectedObj?.isInlineEditMode);
        setTextMode(true);
        setEmojiMode(false);
        setWidgetMode(false);
        setIntegration(selectedObj?.integrations);
        setFocusInputPostion(null);
    }, [refreshToken, selectedObj]);

    useEffect(() => {
        renderColorPath();
    }, [boardColorPath]);

    useEffect(() => {
        setAlignArr([...selectedObj?.alignRowValue]);
        if (!selectedObj?.isInlineEditMode) {
            setValue(parseStringForTextArea());
            setBoardValue(parseStringForTextArea());
        } else {
            setValue(selectedObj?.str);
            setBoardValue(selectedObj?.str);
        }

        setBoardColorPath(selectedObj.colorPath);
        setColorMode(false);
        setTextMode(true);
        setWidgetMode(false);
        setTextAreaDisable(selectedObj?.isInlineEditMode);
        document.body.addEventListener('mousedown', () => {
            setMouseDown(true);
        });
        document.body.addEventListener('mouseup', () => {
            setMouseDown(false);
        });
        document.body.addEventListener('dragend', () => {
            setMouseDown(false);
        });
        document.getElementById('flipBoardMain').addEventListener('click', () => {
            setInit(false);
        });
    }, []);


    useEffect(() => {
        setBoardFrameColor(boardColorsConfig && boardColorsConfig?.frameColor ? {
            background: boardColorsConfig?.frameColor,
        } : null);
        setBoardFlapModuleColor(boardColorsConfig && boardColorsConfig?.flapModule ? {
            background: boardColorsConfig?.flapModule,
            borderTop:  boardColorsConfig?.frameColor && hexToRgbA(boardColorsConfig?.frameColor) ?   `1px solid ${hexToRgbA(boardColorsConfig?.frameColor)}` : null,
            borderRight: boardColorsConfig?.frameColor && hexToRgbA(boardColorsConfig?.frameColor) ?   `1px solid ${hexToRgbA(boardColorsConfig?.frameColor)}` : null,
        } : null);
        setBoardFlapBackgroundColor(boardColorsConfig && boardColorsConfig?.flapBackGroundColor ? {
            background: boardColorsConfig?.flapBackGroundColor,
            border: `1px solid ${boardColorsConfig?.flapBackGroundColor}`,
        } : null);
        setBoardFlapTextColor(boardColorsConfig && boardColorsConfig?.flapTextColor ? {
            color: boardColorsConfig?.flapTextColor,
        } : null);

    }, [boardColorsConfig]);




    useEffect(() => {
        setIntegration(slidesList[selectedIndex]?.integrations);
    }, [slidesList, selectedIndex]);



    return (
        <>
            {/*<audio*/}
            {/*  controls={true}*/}
            {/*  id={'flapAudio'}*/}
            {/*  // ref={(element) => setAdudioDom(element)}*/}
            {/*  src="/flap.mp3"*/}
            {/*></audio>*/}
            {/*<button onClick={onClick}> Animation</button>*/}
            <div
                className={`flipBoardMain ${classes.flipBoardMain}`}
                id={'flipBoardMain'}
            >
                {
                    isShowBoardTitle ? (
                            <p className="text-center board-size-info">
                                <span>{row}</span> x <span>{col}</span> Board - Reception Area
                            </p>
                        ) :
                        <>
                            {
                                isShowDuration ? (
                                    <div className='board-topbar d-flex flex-center'>
                                        <div className="board-topleft">
                <span className='d-flex flex-center'>
                    <span className={'messageName'}>{selectedObj?.messageName}</span>
                    {selectedIndex === 0 ?
                        <>
                  <span className={'live-lable d-flex flex-center'}>
                  <span className='dot'></span><span>Live</span>
                  </span>
                        </>
                        : ''}
                  </span>
                                        </div>
                                        <div className="board-top-right">
                <span>
                  {selectedIndex + 1}/ {slidesList.length}
                </span>
                                            <span>
                  {secondsToTime(selectedObj?.animationSetting?.messageTimeDuration)} Duration
                </span>
                                        </div>
                                    </div>
                                ) : <></>
                            }

                        </>

                }



                <div className={`${classes.flipBoard} custom-scroll custom-scroll-x flipboard`} style={boardFrameColor ? boardFrameColor : {}} id={'flapWrapper'}>
                    {boardOverLay}
                    <TransformWrapper
                        minScale={0.5}
                        maxScale={1}
                        initialScale={1}
                        disablePadding={true}
                        centerOnInit={false}
                        centerZoomedOut={false}
                        doubleClick={{
                            disabled:!isShowZoomBtns,
                        }}
                        pinch={{
                            disabled: !isShowZoomBtns,
                        }}
                        panning={{
                            disabled: isColorMode || isWidgetMode,
                        }}
                        wheel={{
                            disabled: true,
                        }}
                        zoomAnimation={{
                            disabled: !isShowZoomBtns,
                        }}
                        alignmentAnimation={{
                            disabled: !isShowZoomBtns,
                        }}
                        velocityAnimation={{
                            disabled: !isShowZoomBtns,
                        }}
                    >
                        {({ zoomIn, zoomOut, resetTransform, ...rest }) => (
                            <React.Fragment>
                                <div className="tools">
                                    <button id={'zoomInBtn'} className={'hidden'} onClick={() => zoomIn()}>+</button>
                                    <button id={'zoomOutBtn'} className={'hidden'} onClick={() => zoomOut()}>-</button>
                                    <button id={'zoomReset'} className={'hidden'} onClick={() => resetTransform()}>x</button>
                                </div>
                                <TransformComponent>
                                    <div className="board-padding custom-scroll">
                                        <div className={classes.inputMainColumnWrapper}>

                                            {[...Array.from(Array(row).keys())].map((rowIndex) => {
                                                return (
                                                    <>
                                                        <div className={'flipInput-line'}>
                                                            {[...Array.from(Array(col).keys())].map((colIndex) => {
                                                                return (
                                                                    <div className={`${classes.inputColumnWrapper} 
                                            
                                                        ${blockColumns.includes(colIndex - 1) ? 'blockColumnleft' : ''}
                              ${blockColumns.includes(colIndex) ? 'blockColumns' : ''}
                          `}
                                                                         style={boardFlapModuleColor ?  boardFlapModuleColor : {}}
                                                                         onMouseMove={() => {
                                                                             if (isMouseDown && isColorMode) {
                                                                                 setColorPath({
                                                                                     row: rowIndex,
                                                                                     col: colIndex,
                                                                                 });
                                                                             }
                                                                         }}
                                                                         onClick={() =>
                                                                             handleInputClick({ rowIndex, colIndex })
                                                                         }
                                                                    >

                                                                        <input
                                                                            style={boardFlapTextColor ? { ...boardFlapTextColor,
                                                                                zIndex: isWidgetMode ? 1 : 3,
                                                                            } : {
                                                                                zIndex: isWidgetMode ? 1 : 3,
                                                                            }}
                                                                            ref={(el) => {
                                                                                refs.current[rowIndex] = refs.current[rowIndex] || [];
                                                                                refs.current[rowIndex][colIndex] = el;
                                                                            }}
                                                                            className={`${
                                                                                classes.flipInputColInput
                                                                            } textaligncenter ${
                                                                                isTextMode || isEmojiMode || isColorMode || isWidgetMode
                                                                                    ? 'visibleShow'
                                                                                    : 'visibleHide'
                                                                            }
                              ${isColorMode ? 'colorMode' : ''}
                              ${blockColumns.includes(colIndex) ? 'blockColumns' : ''}
                              ${
                                                                                isReadOnlyInputs ?  'readOnly' : ''
                                                                            }
                              ${
                                                                                selectedObj.emojiPath.find(
                                                                                    (slide: any) =>
                                                                                        rowIndex === slide.row &&
                                                                                        colIndex === slide.col,
                                                                                )
                                                                                    ? 'emojiAvailable'
                                                                                    : ''
                                                                            }
                              `}
                                                                            id={`${InputColumnIdPrefix}-row-${rowIndex}-col-${colIndex}`}
                                                                            onPaste={onPaste}
                                                                            // onChange={(e) => handleInputChange({ rowIndex, colIndex, value: e.target.value })}
                                                                            onKeyPress={(event) =>{
                                                                                handleRestrictedChar(event);
                                                                            }}
                                                                            onKeyUp={() => {
                                                                                if (!isReadOnlyInputs) {
                                                                                    if (!isEmojiMode) {
                                                                                        handleInputKeyUp({
                                                                                            event,
                                                                                            rowIndex,
                                                                                            colIndex,
                                                                                        });
                                                                                    }
                                                                                }
                                                                            }}
                                                                            onClick={() =>
                                                                                handleInputClick({ rowIndex, colIndex })
                                                                            }
                                                                            onBlur={() =>
                                                                                setFocusInputPostion({ rowIndex, colIndex })
                                                                            }
                                                                            // contentEditable={true}
                                                                            readOnly={isReadOnlyInputs ? isReadOnlyInputs :  (!isTextMode || isEmojiMode || isColorMode || isAnimationRunnig)}
                                                                            maxLength={1}
                                                                            autoComplete={'off'}
                                                                        />
                                                                        <div
                                                                            className={classes.flipInputColMain}
                                                                            style={boardFlapBackgroundColor ?  boardFlapBackgroundColor : {}}
                                                                            onMouseMove={() => {
                                                                                if (isMouseDown && isColorMode) {
                                                                                    setColorPath({
                                                                                        row: rowIndex,
                                                                                        col: colIndex,
                                                                                    });
                                                                                }
                                                                            }}
                                                                            onClick={() =>
                                                                                handleInputClick({ rowIndex, colIndex })
                                                                            }
                                                                        >

                                                                            <div

                                                                                className={classes.flipInputCol}
                                                                                onClick={() => {
                                                                                    if (isEmojiMode) {
                                                                                        addEmojiInInput({
                                                                                            row: rowIndex,
                                                                                            col: colIndex,
                                                                                        });
                                                                                    }
                                                                                }}
                                                                                style={{ background: TRANSPARENT,
                                                                                    zIndex: isWidgetMode ?  2 : 4,
                                                                                }}
                                                                                id={`${InputColorColumnPrefix}-row-${rowIndex}-col-${colIndex}`}
                                                                            >
                                                                                <>
                                                                                    {renderEmoji({
                                                                                        row: rowIndex,
                                                                                        col: colIndex,
                                                                                    })}
                                                                                </>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                );
                                                            })}
                                                        </div>
                                                    </>
                                                );
                                            })}


                                            {
                                                integration?.length ? (
                                                    <>
                                                        <div className={'dragLayout'} id={'dragLayout'} style={{ zIndex: isWidgetMode ?  4 : 0 }} >
                                                            {
                                                                integration.map(({ row:widgetRow, col:widgetCol, x, y, widgetId, previewString }) =>{
                                                                    return (
                                                                        <>
                                                                            <Draggable
                                                                                // defaultPosition={{ x: 0, y: 0 }}
                                                                                position={{ x:x, y:y }}
                                                                                disabled={isReadOnlyInputs || !isWidgetMode}
                                                                                grid={[BoardGridSize.WIDTH, BoardGridSize.HEIGHT]}
                                                                                bounds={{
                                                                                    left: 0,
                                                                                    /*in this columsize 9*/

                                                                                    right: (BoardGridSize.WIDTH * col) - (BoardGridSize.WIDTH * parseInt(widgetCol)),
                                                                                    /*in this rowsize 9*/

                                                                                    bottom: (BoardGridSize.HEIGHT * row) - (BoardGridSize.HEIGHT  * parseInt(widgetRow)),
                                                                                    top: 0,
                                                                                }}
                                                                                scale={1}
                                                                                onStart={() => {}}
                                                                                onDrag={(e, ui) => {
                                                                                    //
                                                                                    // handleDrag(e, ui, widgetId);
                                                                                }}
                                                                                onStop={(e, ui) => {
                                                                                    handleDrag(e, ui, widgetId);

                                                                                }}
                                                                            >
                                                                                <div className={'widget'} id={widgetId} style={{ width: getDynamicWidthForWidget(widgetCol) }} >
                                                                                    {
                                                                                        [...Array.from(Array(previewString.length).keys())].map((value) => {
                                                                                            return <div> {previewString.charAt(value)}</div>;
                                                                                        })
                                                                                    }
                                                                                    {
                                                                                        !isReadOnlyInputs ? (
                                                                                            <div className={'widgetButtonDiv'}>
                        <span>
                        {/*<WidgetSettingIcon/>*/}
                          </span>
                                                                                                <span onClick={() => removeIntegration(widgetId)}>
                        <WidgetCancelIcon/>
                          </span>
                                                                                            </div>
                                                                                        ) : ''
                                                                                    }



                                                                                </div>


                                                                            </Draggable>

                                                                        </>
                                                                    );
                                                                })
                                                            }
                                                        </div>

                                                    </>
                                                ) : <></>
                                            }


                                        </div>
                                    </div>
                                </TransformComponent>
                            </React.Fragment>
                        )}
                    </TransformWrapper>

                </div>



                <>
                    {isColorMode ? (
                        <>
                            <div
                                className={`${classes.colorSelectionMain} board-bottom-icon`}
                            >
                                <p className="text-center board-size-info">Colors</p>

                                <ul className="d-flex flex-center justify-center">
                                    {availableColors.map((colorCode) => {
                                        return (
                                            <>
                                                <li>
                                                    <button
                                                        className={`${
                                                            colorCode === selectedColor ? 'selected' : ''
                                                        } icon-32 border-icon`}
                                                        onClick={() => setSelectedColor(colorCode)}
                                                        onDoubleClick={() => onDoubleClickOnColorMode(colorCode)}
                                                    >
                                                        <div
                                                            style={{ background: colorCode }}
                                                            className={classes.colorBox}
                                                        ></div>
                                                    </button>
                                                </li>
                                            </>
                                        );
                                    })}
                                    <li>
                                        <button
                                            className={`${
                                                selectedColor === TRANSPARENT ? 'selected' : ''
                                            } icon-32 border-icon erase-icon`}
                                            onClick={() => setSelectedColor(TRANSPARENT)}
                                            onDoubleClick={() => onDoubleClickOnColorMode(TRANSPARENT)}
                                        >
                                            <IconEraser />
                                        </button>
                                    </li>
                                </ul>
                            </div>
                        </>
                    ) : (
                        <></>
                    )}
                </>

                <>
                    {isEmojiMode ? (
                        <>
                            <div
                                className={`${classes.colorSelectionMain} board-bottom-icon`}
                            >
                                <p className="text-center board-size-info">Images</p>

                                <ul className="d-flex flex-center justify-center">
                                    {emojiList.map((emojiValue) => {
                                        return (
                                            <li>
                                                <button
                                                    onClick={() => setSelectedEmoji(emojiValue)}
                                                    className={`${
                                                        selectedEmoji === emojiValue ? classes.selected : ''
                                                    } icon-32 border-icon`}
                                                >
                                                    <div className={classes.colorBox}>
                                                        <img src={`${emojiValue.image}`} />
                                                    </div>
                                                </button>
                                            </li>
                                        );
                                    })}
                                    <li>
                                        <button
                                            className={`${
                                                selectedEmoji === ERASE_EMOJI ? 'selected' : ''
                                            } icon-32 border-icon erase-icon`}
                                            onClick={() => setSelectedEmoji(ERASE_EMOJI)}
                                        >
                                            <IconEraser />
                                        </button>
                                    </li>
                                </ul>
                            </div>
                        </>
                    ) : (
                        <></>
                    )}
                </>



                {
                    <>
                        {isTextMode ? (

                            <>

                                <div className={`${classes.colorSelectionMain} board-bottom-icon`}>
                                    <p className="text-center board-size-info">Special Character</p>
                                    <ul className='d-flex flex-center justify-center special-char-list'>
                                        {spacialChar.map((specialCharValue)=>{

                                            return (<li>
                                                <button className={'icon-32 border-icon'} disabled={isAnimationRunnig} onClick={() =>{
                                                    if (!isAnimationRunnig) {
                                                        if (focusInputPostion !== null) {
                                                            const { rowIndex, colIndex } =  focusInputPostion;
                                                            if (isElementExist(`${InputColumnIdPrefix}-row-${rowIndex}-col-${colIndex}`)) {
                                                                setTextInputValue({ rowI: rowIndex, colI: colIndex, val:specialCharValue });
                                                            }
                                                        } else {
                                                            setValue(value + specialCharValue);
                                                        }

                                                    }
                                                }}>
                                                    {specialCharValue}

                                                </button></li>);
                                        })}


                                    </ul>
                                </div>
                            </>
                        ) : <></>}

                    </>
                }
                <div className={'board-bottom-section'}>
                    {
                        <>
                            {!isHideTextArea  ? (
                                <>
                                    {isTextMode ? (

                                        <div className="borad-textarea">
                                            <label className="form-label">Message</label>
                                            <ANTTextArea
                                                spellCheck={false}
                                                rows={6}
                                                cols={20}
                                                id={'mainTextArea'}
                                                disabled={isAnimationRunnig}
                                                maxLength={row * col}
                                                onMouseUp={onMouseUpForTextArea}
                                                value={value}
                                                showCount={true}
                                                style={{ resize: 'none' }}
                                                onClick={() => {
                                                    setFocusInputPostion(null);
                                                }}
                                                onKeyPress={onKeyChangeForTextArea}
                                                onChange={onChnageForTextArea}
                                                onPaste={onPaste}
                                            ></ANTTextArea>
                                        </div>
                                    ) : (
                                        <></>
                                    )}
                                </>
                            ) : (
                                <></>
                            )}
                        </>

                    }
                </div>
            </div>



        </>
    );
};
export default  forwardRef(Board);
