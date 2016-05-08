import React from "react";
import ReactNative from 'react-native';
import Global, {Styles} from "../Global";
import SQLite from 'react-native-sqlite-storage';
const {
  View,
  Text,
  TextInput,
  ListView,
  RecyclerViewBackedScrollView,
  TouchableHighlight,
  Alert,
} = ReactNative;

SQLite.DEBUG(Global.isDevEnv);
SQLite.enablePromise(true);

// See: https://facebook.github.io/react/docs/reusable-components.html#prop-validation
const propTypes = {
  instructions: React.PropTypes.string,
};

function genRows(pressedRows = {}) {
  let rows = [];
  for (let i = 0; i < 100; i++) {
    rows.push({mm: 'mm ' + i, pali: 'Row ' + i + (pressedRows[i] ? ' (pressed)': '')});
  }
  return rows;
}

class App extends React.Component {

  constructor(props, context) {
    super(props, context);

    let ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

    this.state = {
      q: '',
      dataSource: ds.cloneWithRows(genRows()),
    };

    this.pressRows = {};
  }

  componentDidMount() {
    console.log(SQLite);
    SQLite.echoTest()
      .then(() => {
        Alert.alert("SQLite.echoTest() successful!");
      })
      .catch(() => {
        Alert.alert("SQLite.echoTest() failed!");
      });
  }

  handleSubmitSearch() {
    console.log('handleSubmitSearch', this.state.q);
  }

  handleRowPress(rowID) {
    console.log('handleRowPress', rowID);
    this.pressRows[rowID] = !this.pressRows[rowID];
    this.setState({dataSource: this.state.dataSource.cloneWithRows(genRows(this.pressRows))});
  }

  renderRows(rowData, sectionID, rowID) {
    return (
      <TouchableHighlight onPress={this.handleRowPress.bind(this, rowID)}>
        <View>
          <View style={styles.row}>
            <Text style={styles.rowTitle}>
              {rowData.mm}
            </Text>
            <Text style={styles.rowText}>
              {rowData.pali}
            </Text>
          </View>
        </View>
      </TouchableHighlight>
    );
  }

  render() {
    return (
      <View style={styles.mainContainer}>
        <View style={styles.searchRow}>
          <TextInput
            autoCapitalize="none"
            autoCorrect={false}
            clearButtonMode="always"
            onChangeText={text => {
           this.setState({q: text});
           }}
            placeholder="Search..."
            style={styles.searchTextInput}
            value={this.state.q}
            onSubmitEditing={this.handleSubmitSearch.bind(this)}
          />
        </View>
        <ListView
            dataSource={this.state.dataSource}
            renderRow={this.renderRows.bind(this)}
            renderScrollComponent={props => <RecyclerViewBackedScrollView {...props} />}
            renderSeparator={(sectionID, rowID) => <View key={`${sectionID}-${rowID}`} style={styles.separator} />}
          />
      </View>
    );
  }
}

// See: https://facebook.github.io/react-native/docs/flexbox.html
const styles = ReactNative.StyleSheet.create({
  mainContainer: {
    flex: 1,
    paddingTop: 20,
    backgroundColor: Styles.primaryBackground,
  },
  searchRow: {
    backgroundColor: '#eeeeee',
    padding: 10,
  },
  searchTextInput: {
    backgroundColor: 'white',
    borderColor: '#cccccc',
    borderRadius: 3,
    borderWidth: 1,
    paddingLeft: 8,
    height: 35,
  },

  row: {
    justifyContent: 'center',
    padding: 10,
    backgroundColor: '#F6F6F6',
  },
  separator: {
    height: 1,
    backgroundColor: '#CCCCCC',
  },
  rowContent: {

  },
  rowTitle: {
    fontSize: Styles.mdFont,
  },
  rowText: {
    fontSize: Styles.smFont,
  },

});

App.propTypes = propTypes;

export default App;
