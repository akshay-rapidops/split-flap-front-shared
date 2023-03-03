import { createRendomString } from './util';
import { BoardGridSize, EmojiKeyIdPreFix, FillColorKeyIdPrefix, TextAlign } from "../constant/constant";
import { v4 as uuidv4 } from 'uuid';

export const convertStringtoArrForBoard = (str, col = 40, row = 6) => {
  const renderArr = [];
  let rowIndex = 0;
  let stringIndex = 0 ;
  for (let h = 0; h < str?.length; h++) {
    if (renderArr[rowIndex] && renderArr[rowIndex].length  === col && str.charCodeAt(h) !== 10 ) {
      rowIndex++;
    }
    if (str.charCodeAt(h) === 10) {
      rowIndex ++;
    } else {
      const arrStringValue: any = renderArr[rowIndex] || '';
      renderArr[rowIndex] =  arrStringValue  + str.charAt(stringIndex);
    }
    stringIndex++;
  }
  //   if (rowIndex > 0) {
  //     // after 39 character new line
  //     if (renderArr[rowIndex]?.length > col) {
  //       rowIndex++;
  //       startIndex = startIndex + col;
  //     }
  //   }
  //
  //   if (h > startIndex || str.charCodeAt(h) === 10) {
  //     // cliek on enter new line code
  //     console.log((startIndex + 1), h);
  //     if ((startIndex + 1) === h && str.charAt(h) === '\n' ) {
  //
  //     } else {
  //       rowIndex++;
  //       startIndex = startIndex + col;
  //
  //     }
  //     console.log((rowIndex + 1) * h, str.charAt(h));
  //   }
  //   if (str.charCodeAt(h) !== 10) {
  //     const arrStringValue: any = renderArr[rowIndex] || '';
  //     renderArr[rowIndex] = arrStringValue + str.charAt(h);
  //   }
  // }
  if (renderArr.length && renderArr.length > row) {
    return  renderArr.slice(0, row);
  }

  return renderArr;
};


export const createSlideObj = (rowValue = 6,props = {}) => {
  return {
    uniqueId:uuidv4(),
    id: createRendomString(10),
    position: TextAlign.LEFT,
    str: '',
    stringArray: [],
    isInlineEditMode: false,
    // @ts-ignore
    alignRowValue: [...Array(rowValue).keys()].map(() => TextAlign.CENTER),
    colorPath: [],
    emojiPath: [],
    integrations: [
      // {
      //   type: 'countDown',
      //   row:3,
      //   col:9,
      //   x:0,
      //   y:0,
      //   widgetId: `widget${uuidv4()}`,
      //
      // },
      // {
      //   type: 'countDown',
      //   row:3,
      //   col:9,
      //   x:0,
      //   y:0,
      //   widgetId: `widget${uuidv4()}`,
      //
      // },
    ],
    isAnimationSettingDialogOpen: false,
    isMessageDurationSettingDialogOpen: false,
    animationSetting: {
      animationStyle: 'None',
      isEnabledSplitAnimation: true,
      animationTimeDuration: 5,
      messageTimeDuration: 5,
    },
    ...props,
  };
};


export  const dynamicHeightWidthForPreviewColumn = ({ col, row }) => {
  return {
    width: `${100 / col}%`,
    height: `${100 / row}%`,
  };
};



export const parseDataForScreenSet = ({ messageDetail, rowValue = 6, boardIcon = [] }) => {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  const { screen_set }  = messageDetail;
  const slideListArr = [];
  let colorPath = [];
  let emojiPath = [];
  let str =  '';
  screen_set.map(({ animation_spin, data, animation_duration, duration, id, aligns, animation_name, message_name = null, integrations }) => {
    str = '';
    colorPath = [];
    emojiPath = [];
    if (data) {
      data.map((dataRow, rowIndex) =>{
        dataRow.map(({ type, char = ' ', hex_code = null, filename = null }, colIndex) => {
          str =  str + char;
          if (type === 2 && hex_code) {
            colorPath.push({
              key: `${FillColorKeyIdPrefix}-row-${rowIndex}-col-${colIndex}`,
              row:rowIndex,
              col:colIndex,
              color: hex_code,
            });
          }

          if (type === 3 && filename) {
            const findImage: any =  boardIcon.find(({ name }) => filename === name);
            if (findImage) {
              emojiPath.push({
                key: `${EmojiKeyIdPreFix}-row-${rowIndex}-col-${colIndex}`,
                row:rowIndex,
                col:colIndex,
                src:findImage.image,
                name: findImage.name,
              });
            }

          }
        });


      });
    }
    // id pass only for edit
    slideListArr.push({
      uniqueId:uuidv4(),
      id:id,
      dragId: createRendomString(10),
      position: TextAlign.LEFT,
      str: str,
      stringArray:  data || [],
      isInlineEditMode: true,
      alignRowValue: aligns ?  aligns :  [...Array.from(Array(rowValue).keys())].map(() => TextAlign.CENTER),
      colorPath: colorPath,
      emojiPath: emojiPath,
      integrations: integrations.map((integration) => {
        return {
          ...integration,
          id:integration.id,
          row:integration.height,
          col:integration.width,
          // x:integration.col,
          // y:integration.col,
          // gridXPos: integration.row * BoardGridSize.WIDTH,
          // gridYPos:  integration.col * BoardGridSize.HEIGHT,
          gridXPos: integration.col,
          gridYPos: integration.row,
          x: integration.col *  BoardGridSize.WIDTH,
          y: integration.row *  BoardGridSize.HEIGHT,
          widgetId: `widget${uuidv4()}`,
          previewString:integration.preview,
        };
      }),
      isAnimationSettingDialogOpen: false,
      isMessageDurationSettingDialogOpen: false,
      messageName: message_name,
      animationSetting: {
        animationStyle: animation_name,
        isEnabledSplitAnimation: animation_spin,
        animationTimeDuration: (animation_duration / 1000),
        messageTimeDuration: (duration / 1000),
      },
    });



  });
  return slideListArr;
  // dispatch(setSlideList([...slideListArr]));
};




