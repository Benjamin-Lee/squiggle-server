// squiggle nested array return
export function x_squiggle(length: i32): Float64Array {
  let x_vals = new Float64Array(2 * length + 1);
  let xCoord: f64 = 0;

  for (let i = 1; i <= 2 * length; i++) {
    unchecked((x_vals[i] = xCoord + 0.5));
    xCoord += 0.5;
  }

  return x_vals;
}

export function y_squiggle(sequence: string, length: i32): Float64Array {
  sequence = sequence.toUpperCase();

  let y_vals = new Float64Array(2 * length + 1);

  for (let i = 0; i < 2 * length; i += 2) {
    switch (sequence.charCodeAt(i >>> 1)) {
      case 0x41: // "A"
        unchecked((y_vals[i + 1] = y_vals[i] + 0.5));
        unchecked((y_vals[i + 2] = y_vals[i]));
        break;
      case 0x43: // "C"
        unchecked((y_vals[i + 1] = y_vals[i] - 0.5));
        unchecked((y_vals[i + 2] = y_vals[i]));
        break;
      case 0x54:
      case 0x55: // "T" && "U"
        unchecked((y_vals[i + 1] = y_vals[i] - 0.5));
        unchecked((y_vals[i + 2] = y_vals[i] - 1));
        break;
      case 0x47: // "G"
        unchecked((y_vals[i + 1] = y_vals[i] + 0.5));
        unchecked((y_vals[i + 2] = y_vals[i] + 1));
        break;
      default:
        unchecked((y_vals[i + 1] = y_vals[i]));
        unchecked((y_vals[i + 2] = y_vals[i]));
        break;
    }
  }

  return y_vals;
}

// squiggle single array return
export function squiggle(sequence: string, length: i32): Float64Array {
  sequence = sequence.toUpperCase();

  let result = new Float64Array(4 * length + 2);

  let yCoord = 0.0;
  let xCoord = 0.0;

  for (let i = 0; i < length; i++) {
    unchecked((result[2 * i + 1] = xCoord + 0.5));
    unchecked((result[2 * i + 2] = xCoord + 1.0));
    xCoord++;
    switch (sequence.charCodeAt(i)) {
      case 0x41: // "A"
        unchecked((result[2 * (length + i) + 2] = yCoord + 0.5));
        unchecked((result[2 * (length + i) + 3] = yCoord));
        break;
      case 0x43: // "C"
        unchecked((result[2 * (length + i) + 2] = yCoord - 0.5));
        unchecked((result[2 * (length + i) + 3] = yCoord));
        break;
      case 0x54: // "T"
        unchecked((result[2 * (length + i) + 2] = yCoord - 0.5));
        unchecked((result[2 * (length + i) + 3] = yCoord - 1));
        yCoord -= 1;
        break;
      case 0x47: // "G"
        unchecked((result[2 * (length + i) + 2] = yCoord + 0.5));
        unchecked((result[2 * (length + i) + 3] = yCoord + 1));
        yCoord += 1.0;
        break;
      default:
        unchecked((result[2 * (length + i) + 2] = yCoord));
        unchecked((result[2 * (length + i) + 3] = yCoord));
        break;
    }
  }
  return result;
}

// gates single array return
export function gates(sequence: string, length: i32): Float64Array {
  sequence = sequence.toUpperCase();

  let result = new Float64Array(2 * length + 2);

  let xCoord: f64 = 0.0;
  let yCoord: f64 = 0.0;

  for (let i = 0; i < length; i++) {
    switch (sequence.charCodeAt(i)) {
      case 0x41: // "A"
        yCoord--;
        break;
      case 0x43: // "C"
        xCoord--;
        break;
      case 0x54:
      case 0x55: // "T" && "U"
        yCoord++;
        break;
      case 0x47: // "G"
        xCoord++;
        break;
      default:
        throw new Error('non-atgcu base');
        break;
    }

    unchecked((result[i + 1] = xCoord));
    unchecked((result[length + i + 2] = yCoord));
  }

  return result;
}

export let key = new Map<string, i32>();
key.set('AA', 12);
key.set('AC', 4);
key.set('GT', 6);
key.set('AG', 0);
key.set('CC', 13);
key.set('CA', 5);
key.set('CG', 10);
key.set('TT', 15);
key.set('GG', 14);
key.set('GC', 11);
key.set('AT', 8);
key.set('GA', 1);
key.set('TG', 7);
key.set('TA', 9);
key.set('TC', 3);
key.set('CT', 2);
//qi nested array return
export function y_qi(sequence: string, length: i32): Float64Array {
  sequence = sequence.toUpperCase();

  const result = new Float64Array(length - 1);

  for (let i = 0; i < length - 1; i++) {
    let Ch_1 = sequence.charCodeAt(i + 0);
    let Ch_2 = sequence.charCodeAt(i + 1);
    switch (Ch_1) {
      case 0x41:
        switch (Ch_2) {
          case 0x41: // AA
            unchecked((result[i] = 12));
            break
          case 0x43: // AC
            unchecked((result[i] = 4));
            break
          case 0x54: // AT
          case 0x55: // AU
            unchecked((result[i] = 8));
            break
          case 0x47: // AG
            unchecked((result[i] = 0));
        }
        break
      case 0x43:
        switch (Ch_2) {
          case 0x41: // CA
            unchecked((result[i] = 5));
            break
          case 0x43: // CC
            unchecked((result[i] = 13));
            break
          case 0x54: // CT
          case 0x55: // CU
            unchecked((result[i] = 2));
            break
          case 0x47: // CG
            unchecked((result[i] = 10));
        }
        break
      case 0x54:
      case 0x55:
        switch (Ch_2) {
          case 0x41: // TA, UA
            unchecked((result[i] = 9));
            break
          case 0x43: // TC, UC
            unchecked((result[i] = 3));
            break
          case 0x54: // TT
          case 0x55: // UU
            unchecked((result[i] = 15));
            break
          case 0x47: // TG, UG
            unchecked((result[i] = 7));
        }
        break
      case 0x47:
        switch (Ch_2) {
          case 0x41: // GA
            unchecked((result[i] = 1));
            break
          case 0x43: // GC
            unchecked((result[i] = 11));
            break
          case 0x54: // GT
          case 0x55: // GU
            unchecked((result[i] = 6));
            break
          case 0x47: // GG
            unchecked((result[i] = 14));
        }
    }
  }

  return result;
}

export function x_qi(length: i32): Float64Array {
  let x_vals = new Float64Array(length - 1);
  let xCoord: f64 = 0;

  for (let i = 0; i < length - 1; i++) {
    unchecked((x_vals[i] = xCoord));
    xCoord += 1.0;
  }

  return x_vals;
}

// yau-bp nested array return
export function x_yau_bp(length: i32): Float64Array {
  let x_vals = new Float64Array(length + 1);
  let xCoord: f64 = 1;

  for (let i = 1; i <= length; i++) {
    unchecked((x_vals[i] = xCoord));
    xCoord++;
  }

  return x_vals;
}

export function y_yau_bp(sequence: string, length: i32): Float64Array {
  sequence = sequence.toUpperCase();

  let y_vals = new Float64Array(length + 1);
  let yCoord = 0.0;
  for (let i = 1; i <= length; i++) {
    switch (sequence.charCodeAt(i - 1)) {
      case 0x41: // "A"
        unchecked((y_vals[i] = yCoord - 1));
        yCoord--;
        break;
      case 0x43: // "C"
        unchecked((y_vals[i] = yCoord + 0.5));
        yCoord += 0.5;
        break;
      case 0x54:
      case 0x55: // "T" && "U"
        unchecked((y_vals[i] = yCoord + 1));
        yCoord++;
        break;
      case 0x47: // "G"
        unchecked((y_vals[i] = yCoord - 0.5));
        yCoord -= 0.5;
        break;
      default:
        throw new Error('non-atgcu base');
        break;
    }
  }

  return y_vals;
}

// yau single array return
export function yau(sequence: string, length: i32): Float64Array {
  sequence = sequence.toUpperCase();

  let result = new Float64Array(2 * length + 2);

  let onehalfsqrt3 = 3 ** 0.5 / 2;

  let xCoord = 0.0;
  let yCoord = 0.0;
  for (let i = 1; i <= length; i++) {
    switch (sequence.charCodeAt(i - 1)) {
      case 0x41: // "A"
        unchecked((result[i] = xCoord + 0.5));
        unchecked((result[i + length + 1] = yCoord - onehalfsqrt3));
        xCoord += 0.5;
        yCoord -= onehalfsqrt3;
        break;
      case 0x43: // "C"
        unchecked((result[i] = xCoord + onehalfsqrt3));
        unchecked((result[i + length + 1] = yCoord + 0.5));
        xCoord += onehalfsqrt3;
        yCoord += 0.5;
        break;
      case 0x54:
      case 0x55: // "T" && "U"
        unchecked((result[i] = xCoord + 0.5));
        unchecked((result[i + length + 1] = yCoord + onehalfsqrt3));
        xCoord += 0.5;
        yCoord += onehalfsqrt3;
        break;
      case 0x47: // "G"
        unchecked((result[i] = xCoord + onehalfsqrt3));
        unchecked((result[i + length + 1] = yCoord - 0.5));
        xCoord += onehalfsqrt3;
        yCoord -= 0.5;
        break;
      default:
        throw new Error('non-atgcu base');
        break;
    }
  }
  return result;
}

// randic nested array return
export function y_randic(sequence: string, length: i32): Float64Array {
  sequence = sequence.toUpperCase();

  let y_vals = new Float64Array(length);

  for (let i = 0; i < length; i++) {
    switch (sequence.charCodeAt(i)) {
      case 0x41: // "A"
        unchecked((y_vals[i] = 3));
        break;
      case 0x43: // "C"
        unchecked((y_vals[i] = 0));
        break;
      case 0x54:
      case 0x55: // "T" && "U"
        unchecked((y_vals[i] = 2));
        break;
      case 0x47: // "G"
        unchecked((y_vals[i] = 1));
        break;
      default:
        throw new Error('non-atgcu base');
        break;
    }
  }

  return y_vals;
}

export function x_randic(length: i32): Float64Array {
  let x_vals = new Float64Array(length);
  let xCoord: f64 = 0;

  for (let i = 0; i < length; i++) {
    unchecked((x_vals[i] = xCoord));
    xCoord++;
  }

  return x_vals;
}