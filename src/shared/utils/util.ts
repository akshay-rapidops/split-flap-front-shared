export const maxAllowedNumber = (noOfDigits = 1) => {
  return Number('9'.repeat(noOfDigits));
};

export const mobileWidth = 768;
export const tabletWidth = 1024;

export const formatedNumber = (digit) => {
  return digit?.toLocaleString('en-US', {
    minimumIntegerDigits: 2,
    useGrouping: false,
  });
};

export const secondsToTimeformat = (e) => {
  const h = Math.floor(e / 3600)
      .toString()
      .padStart(2, '0'),
    m = Math.floor((e % 3600) / 60)
      .toString()
      .padStart(2, '0'),
    s = Math.floor(e % 60)
      .toString()
      .padStart(2, '0');

  return `${h}h ${m}m ${s}s`;
};

export const createRendomString = (length) => {
  let result = '';
  let characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};

export const secondsToTime = (e) => {
  const h = Math.floor(e / 3600)
      .toString()
      .padStart(2, '0'),
    m = Math.floor((e % 3600) / 60)
      .toString()
      .padStart(2, '0'),
    s = Math.floor(e % 60)
      .toString()
      .padStart(2, '0');

  return h + ':' + m + ':' + s;
};

export const secondsToTimeh = (e, isReturnObj = false) => {
  let m;
  if (isReturnObj) {
    m = Math.floor((e % 3600) / 60)
      .toString()
      .padStart(1, '0');
  } else {
    m = Math.floor((e % 3600) / 60)
      .toString()
      .padStart(2, '0');
  }
  let s = Math.floor(e % 60)
    .toString()
    .padStart(2, '0');

  if (isReturnObj) {
    return {
      min: m,
      sec: s,
    };
  }

  return m + ':' + s;
};

export const secondsToTimesec = (e) => {
  const s = Math.floor(e % 60)
    .toString()
    .padStart(2, '0');
  return s;
};

export const getTimeZone = () => {
  var offset = new Date().getTimezoneOffset(),
    o = Math.abs(offset);

  return {
    offsetSign: offset < 0 ? '+' : '-',
    hour: ('00' + Math.floor(o / 60)).slice(-2),
    mini: ('00' + (o % 60)).slice(-2),
  };
};
export const getUtcweekday = (repeaton, start) =>{
  const newarr = [];
  repeaton.map(({ weekday })=>{
    if (new Date(start).getDate() < new Date(start).getUTCDate()) {
      if (weekday == 0) {
        newarr.push(new Date(start).getDate() < new Date(start).getUTCDate() ? 1 : weekday);
      }
      if (weekday == 1) {
        newarr.push(new Date(start).getDate() < new Date(start).getUTCDate() ? 2 : weekday);
      }
      if (weekday == 2) {
        newarr.push(new Date(start).getDate() < new Date(start).getUTCDate() ? 3 : weekday);
      }
      if (weekday == 3) {
        newarr.push(new Date(start).getDate() < new Date(start).getUTCDate() ? 4 : weekday);
      }
      if (weekday == 4) {
        newarr.push(new Date(start).getDate() < new Date(start).getUTCDate() ? 5 : weekday);
      }
      if (weekday == 5) {
        newarr.push(new Date(start).getDate() < new Date(start).getUTCDate() ? 6 : weekday);
      }
      if (weekday == 6) {
        newarr.push(new Date(start).getDate() < new Date(start).getUTCDate() ? 0 : weekday);
      }
    } else {
      if (weekday == 0) {
        newarr.push(new Date(start).getDate() > new Date(start).getUTCDate() ? 6 : weekday);
      }
      if (weekday == 1) {
        newarr.push(new Date(start).getDate() > new Date(start).getUTCDate() ? 0 : weekday);
      }
      if (weekday == 2) {
        newarr.push(new Date(start).getDate() > new Date(start).getUTCDate() ? 1 : weekday);
      }
      if (weekday == 3) {
        newarr.push(new Date(start).getDate() > new Date(start).getUTCDate() ? 2 : weekday);
      }
      if (weekday == 4) {
        newarr.push(new Date(start).getDate() > new Date(start).getUTCDate() ? 3 : weekday);
      }
      if (weekday == 5) {
        newarr.push(new Date(start).getDate() > new Date(start).getUTCDate() ? 4 : weekday);
      }
      if (weekday == 6) {
        newarr.push(new Date(start).getDate() > new Date(start).getUTCDate() ? 5 : weekday);
      }
    }

  });
  return { newarr };
};
export const utcweekday = (repeaton, start, newStart) =>{
  const newarr = [];
  repeaton.map(({ weekday })=>{
    // if (stopFlag) {
    //   if (weekday == 0) {
    //     newarr.push(weekday);
    //   }
    //   if (weekday == 1) {
    //     newarr.push(weekday);

    //   }
    //   if (weekday == 2) {
    //     newarr.push(weekday);

    //   }
    //   if (weekday == 3) {
    //     newarr.push(weekday);

    //   }
    //   if (weekday == 4) {
    //     newarr.push(weekday);

    //   }
    //   if (weekday == 5) {
    //     newarr.push(weekday);

    //   }
    //   if (weekday == 6) {
    //     newarr.push(weekday);

    //   }
    // }

    if (newStart > start) {
      if (weekday == 0) {
        newarr.push(newStart > start ? 1 : weekday);
      }
      if (weekday == 1) {
        newarr.push(newStart > start ? 2 : weekday);
      }
      if (weekday == 2) {
        newarr.push(newStart > start ? 3 : weekday);
      }
      if (weekday == 3) {
        newarr.push(newStart > start ? 4 : weekday);
      }
      if (weekday == 4) {
        newarr.push(newStart > start ? 5 : weekday);
      }
      if (weekday == 5) {
        newarr.push(newStart > start ? 6 : weekday);
      }
      if (weekday == 6) {
        newarr.push(newStart > start ? 0 : weekday);
      }
    } else if (start == newStart) {
      if (weekday == 0) {
        newarr.push(weekday);
      }
      if (weekday == 1) {
        newarr.push(weekday);

      }
      if (weekday == 2) {
        newarr.push(weekday);

      }
      if (weekday == 3) {
        newarr.push(weekday);

      }
      if (weekday == 4) {
        newarr.push(weekday);

      }
      if (weekday == 5) {
        newarr.push(weekday);

      }
      if (weekday == 6) {
        newarr.push(weekday);

      }
    } else {
      if (weekday == 0) {
        newarr.push(newStart < start ? 6 : weekday);
      }
      if (weekday == 1) {
        newarr.push(newStart < start ? 0 : weekday);
      }
      if (weekday == 2) {
        newarr.push(newStart < start ? 1 : weekday);
      }
      if (weekday == 3) {
        newarr.push(newStart < start ? 2 : weekday);
      }
      if (weekday == 4) {
        newarr.push(newStart < start ? 3 : weekday);
      }
      if (weekday == 5) {
        newarr.push(newStart < start ? 4 : weekday);
      }
      if (weekday == 6) {
        newarr.push(newStart < start ? 5 : weekday);
      }
    }

  });
  return { newarr };
};
export const utcweekdayEditDisplay = (repeaton, start, newStart) =>{
  const newarr = [];
  repeaton.map(({ weekday })=>{
    if (newStart > start) {
      if (weekday == 0) {
        newarr.push(newStart > start ? 1 : weekday);
      }
      if (weekday == 1) {
        newarr.push(newStart > start ? 2 : weekday);
      }
      if (weekday == 2) {
        newarr.push(newStart > start ? 3 : weekday);
      }
      if (weekday == 3) {
        newarr.push(newStart > start ? 4 : weekday);
      }
      if (weekday == 4) {
        newarr.push(newStart > start ? 5 : weekday);
      }
      if (weekday == 5) {
        newarr.push(newStart > start ? 6 : weekday);
      }
      if (weekday == 6) {
        newarr.push(newStart > start ? 0 : weekday);
      }
    } else if (start == newStart) {
      if (weekday == 0) {
        newarr.push(weekday);
      }
      if (weekday == 1) {
        newarr.push(weekday);

      }
      if (weekday == 2) {
        newarr.push(weekday);

      }
      if (weekday == 3) {
        newarr.push(weekday);

      }
      if (weekday == 4) {
        newarr.push(weekday);

      }
      if (weekday == 5) {
        newarr.push(weekday);

      }
      if (weekday == 6) {
        newarr.push(weekday);

      }
    } else {
      if (weekday == 0) {
        newarr.push(newStart < start ? weekday : 6);
      }
      if (weekday == 1) {
        newarr.push(newStart < start ? weekday : 0);
      }
      if (weekday == 2) {
        newarr.push(newStart < start ? weekday : 1);
      }
      if (weekday == 3) {
        newarr.push(newStart < start ? weekday : 2);
      }
      if (weekday == 4) {
        newarr.push(newStart < start ? weekday : 3);
      }
      if (weekday == 5) {
        newarr.push(newStart < start ? weekday : 4);
      }
      if (weekday == 6) {
        newarr.push(newStart < start ? weekday : 5);
      }
    }

  });
  return { newarr };
};
export const editUtcweekday = (repeaton, start) =>{
  const newarr = [];
  repeaton?.map(({ weekday })=>{
    if (new Date(start).getDate() > new Date(start).getUTCDate()) {
      if (weekday == 0) {
        newarr.push(new Date(start).getDate() < new Date(start).getUTCDate() ? weekday : 1);
      }
      if (weekday == 1) {
        newarr.push(new Date(start).getDate() < new Date(start).getUTCDate() ? weekday : 2);
      }
      if (weekday == 2) {
        newarr.push(new Date(start).getDate() < new Date(start).getUTCDate() ? weekday : 3);
      }
      if (weekday == 3) {
        newarr.push(new Date(start).getDate() < new Date(start).getUTCDate() ? weekday : 4);
      }
      if (weekday == 4) {
        newarr.push(new Date(start).getDate() < new Date(start).getUTCDate() ? weekday : 5);
      }
      if (weekday == 5) {
        newarr.push(new Date(start).getDate() < new Date(start).getUTCDate() ? weekday : 6);
      }
      if (weekday == 6) {
        newarr.push(new Date(start).getDate() < new Date(start).getUTCDate() ? weekday : 0);
      }
    } else {
      if (weekday == 0) {
        newarr.push(new Date(start).getDate() > new Date(start).getUTCDate() ? 6 : weekday);
      }
      if (weekday == 1) {
        newarr.push(new Date(start).getDate() > new Date(start).getUTCDate() ? 0 : weekday);
      }
      if (weekday == 2) {
        newarr.push(new Date(start).getDate() > new Date(start).getUTCDate() ? 1 : weekday);
      }
      if (weekday == 3) {
        newarr.push(new Date(start).getDate() > new Date(start).getUTCDate() ? 2 : weekday);
      }
      if (weekday == 4) {
        newarr.push(new Date(start).getDate() > new Date(start).getUTCDate() ? 3 : weekday);
      }
      if (weekday == 5) {
        newarr.push(new Date(start).getDate() > new Date(start).getUTCDate() ? 4 : weekday);
      }
      if (weekday == 6) {
        newarr.push(new Date(start).getDate() > new Date(start).getUTCDate() ? 5 : weekday);
      }
    }

  });
  return { newarr };
};


export const hexToRgbA = (hex) => {
  let c;
  if (/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)) {
    c = hex.substring(1).split('');
    if (c.length == 3) {
      c = [c[0], c[0], c[1], c[1], c[2], c[2]];
    }
    c = '0x' + c.join('');
    return 'rgba(' + [(c >> 16) & 255, (c >> 8) & 255, c & 255].join(',') + ',0.5)';
  }
  return null;
};

