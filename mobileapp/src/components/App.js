import React from "react";
import ReactNative from "react-native";
import {Styles} from "../Global";
import Sql from "../Sql";
const {
  View,
  Text,
  TextInput,
  ListView,
  RecyclerViewBackedScrollView,
  TouchableHighlight,
  Alert,
} = ReactNative;

// See: https://facebook.github.io/react/docs/reusable-components.html#prop-validation
const propTypes = {
  instructions: React.PropTypes.string,
};

class App extends React.Component {

  constructor(props, context) {
    super(props, context);

    let ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

    this.state = {
      q: 'ခက',
      dataSource: ds.cloneWithRows([]),
    };

    this.pressRows = {};
  }

  componentDidMount() {
    console.log('componentDidMount');
    Sql.openDB()
      .then(() => {
        this.queryPaliStartsWith();
      });
  }

  componentWillUnmount() {
    console.log('componentWillUnmount');
    Sql.closeDB();
  }

  queryPaliStartsWith() {
    Sql.pali_contains(this.state.q)
      .then(rows => {
        this.setState({dataSource: this.state.dataSource.cloneWithRows(rows)});
      });
  }

  handleSubmitSearch() {
    console.log('handleSubmitSearch', this.state.q);

    // Sql.query('SELECT * FROM sqlite_master')
    //   .then(rows => {
    //     console.log('sqlite_master', rows);
    //   });
    this.queryPaliStartsWith();
  }

  handleRowPress(rowID) {
    console.log('handleRowPress', rowID);
  }

  renderRow(rowData, sectionID, rowID) {
    console.log('renderRow', rowData);
    return (
      <TouchableHighlight onPress={this.handleRowPress.bind(this, rowID)}>
        <View>
          <View style={styles.row}>
            <Text style={styles.rowTitle}>
              {rowData.pali}
            </Text>
            <Text style={styles.rowText}>
              {rowData.mm}
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
          renderRow={this.renderRow.bind(this)}
          renderScrollComponent={props => <RecyclerViewBackedScrollView {...props} />}
          renderSeparator={(sectionID, rowID) => <View key={`${sectionID}-${rowID}`} style={styles.separator} />}
          enableEmptySections={true}
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
  rowContent: {},
  rowTitle: {
    fontSize: Styles.mdFont,
  },
  rowText: {
    fontSize: Styles.smFont,
  },

});

App.propTypes = propTypes;

export default App;
