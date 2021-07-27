function isEven(n) {
  if (n == 0)
    return true;
  else if (n == 1)
    return false;
  else {
    /*
    return isEven(n - 2);
    isEven(-1) ->
    RangeError: Maximum call stack size exceeded
    因为负数 -2n 永远也到不了0 或 1，会导致调用栈溢出（StackOverflow hhh）。
    解决方法：
    */
    return n > 0 ? isEven(n - 2) : isEven(n + 2);
  }
}

// test
console.log('50 is even: ', isEven(50));
console.log('75 is even: ', isEven(75));
console.log('What happens to -1:', isEven(-1));