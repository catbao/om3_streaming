// let lastMaxIndex = 1023;
// for(let i=0;i<17;++i){
//     let batch = 2048;
//     if(i == 0) lastMaxIndex = 1023;
//     else if(i == 1) lastMaxIndex += 1023;
//     else  lastMaxIndex += (1023 + getMultiples(i));
//     console.log(lastMaxIndex);
// }

function getMultiples(n) {
    if (n % 2 === 1) { 
      return 0;
    } else {
      let i = 0;
      while (n % Math.pow(2, i+1) === 0) { 
        i++;
      }
      return i; 
    }
}

//   let L = 20;
//   let array = new Array(21);
//   array[L] = new Array(1);
//   array[L][0] = 2 ** (20) - 1;
//   for(let i = 19; i > 0 ;--i){
//       array[i] = new Array(2**(L - i));
//       for(let j = 0; j < array[i+1].length; ++j){
//           array[i][2*j] = array[i+1][j] - 2**(i);
//           array[i][2*j+1] = array[i+1][j] - 1;
//       }
//   }

  let L = 10;
  let array = new Array(11);
  array[L] = new Array(1);
  array[L][0] = 2 ** (20) - 1;
  for(let i = 9; i >= 0 ;--i){
      array[i] = new Array(2**(L - i));
      for(let j = 0; j < array[i+1].length; ++j){
          array[i][2*j] = array[i+1][j] - 2**(i+10);
          array[i][2*j+1] = array[i+1][j] - 1;
      }
  }
  console.log(array)