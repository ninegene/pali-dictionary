

## Notes

### Add `react-native-sqlite-storage` package

#### ios

```
$ npm -g install rnpm xcode

$ cd mobileapp
$ npm install --save react-native-sqlite-storage
$ rnpm link
```

Need to manually add `libsqlite3.0.tbd` to Xcode project's `Build Phases` : `Link Binary With Libraries` section to fix the following issue.

```
Undefined symbols for architecture x86_64:
  "_sqlite3_bind_double", referenced from:
      -[SQLite bindStatement:withArg:atIndex:] in libSQLite.a(SQLite.o)
  "_sqlite3_bind_int", referenced from:
      -[SQLite bindStatement:withArg:atIndex:] in libSQLite.a(SQLite.o)
  "_sqlite3_bind_int64", referenced from:
...
  "_sqlite3_value_text", referenced from:
      _sqlite_regexp in libSQLite.a(SQLite.o)
ld: symbol(s) not found for architecture x86_64
clang: error: linker command failed with exit code 1 (use -v to see invocation)
```

#### android

Follow the steps on https://github.com/andpor/react-native-sqlite-storage


#### Examples

See:
 * https://github.com/andpor/react-native-sqlite-storage/blob/master/test/index.ios.promise.js