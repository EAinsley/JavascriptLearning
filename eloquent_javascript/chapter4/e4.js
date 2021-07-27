function deepEqual(a, b) {
  if (a && b && (typeof a == 'object') && (typeof b == 'object')) {
    if (Object.keys(a).length != Object.keys(b).length)
      return false;
    for (let key of Object.keys(a)) {
      if (!(key in b) || !deepEqual(a[key], b[key]))
        return false;
    }
    return true;
  } else {
    return a === b;
  }
}