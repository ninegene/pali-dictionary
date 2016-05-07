#!/usr/bin/env bash
set -e

readonly PROGDIR=$(cd $(dirname $0); pwd)
readonly ARGS=$@

kill_react_native_packager() {
  if nc -w 5 -z localhost 8081 ; then
    if ! curl -s "http://localhost:8081/status" | grep -q "packager-status:running" ; then
      echo "Port 8081 already in use, packager is either not running or not running correctly"
    else
      local pid=$(lsof -i :8081 | awk '/^node/ {print $2}' | uniq)
      if [[ ${pid} ]]; then
        echo "Killing react native packager"
        local ppid=$(ps -o ppid -p ${pid} | tail -n +2)
        (set -x; kill ${pid} ${ppid})
      fi
    fi
  fi
}

start_react_native_packager() {
  # For Mac OSX
  open ${PROGDIR}/node_modules/react-native/packager/launchPackager.command

  # todo for Linux
}

run_android() {
  cd ${PROGDIR}
  react-native run-android --debug --stacktrace
  adb logcat *:S ReactNative:V ReactNativeJS:V
}

run_ios() {
  cd ${PROGDIR}
  react-native run-ios --debug --stacktrace
}

main() {
  local platform=${1-ios}
  kill_react_native_packager
  start_react_native_packager
  run_${platform}
}

main ${ARGS}