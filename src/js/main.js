// will transpile to es5

const arr = [1, 2];
console.log([...arr]);

class Foo {
  constructor() {
    this.publicField = this.#privateMethod();
  }

  #privateMethod() {
    return 420;
  }
}

const f = new Foo();
console.log(f.publicField);
