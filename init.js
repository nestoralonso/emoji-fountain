// This is an helper for invoking the main function for various cases
if(typeof myLab !== 'undefined') {
  console.log('Using iife');
  myLab.main();
}else {
  console.log('You are using rollup.js with the default options (es6)');
  main();
}
