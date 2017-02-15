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
  Switch,
} = ReactNative;

// See: https://facebook.github.io/react/docs/reusable-components.html#prop-validation
const propTypes = {
  instructions: React.PropTypes.string,
};

const UNICODE_FONT = 'Padauk';
const ZAWGYI_FONT = 'Zawgyi-One';

// const UNICODE_FONT_DISPLAY_NAME = 'Unicode (Padauk)';
// const ZAWGYI_FONT_DISPLAY_NAME = 'Zawgyi-One';

class App extends React.Component {

  constructor(props, context) {
    super(props, context);

    let ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => {
        let hasChanged = r1 !== r2 || this.state.wasUnicode !== this.state.isUnicode;
        // console.log('rowHasChanged was:', this.state.wasUnicode, ' is:', this.state.isUnicode);
        // console.log('rowHasChanged', hasChanged);
        return hasChanged;
      }
    });

    let rows = [];

    this.state = {
      wasUnicode: false,
      isUnicode: true,
      q: 'ခက',
      rows: rows,
      dataSource: ds.cloneWithRows(rows),
    };
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
        this.setState({
          rows: rows,
          dataSource: this.state.dataSource.cloneWithRows(rows),
        });
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

  handleFontSwitch(isUnicode) {
    console.log('handleFontSwitch', isUnicode);
    let wasUnicode = this.state.isUnicode; // old value
    this.setState({
      wasUnicode: wasUnicode,
      isUnicode: isUnicode,
      dataSource: this.state.dataSource.cloneWithRows(this.state.rows),
    });
  }

  renderRow(rowData, sectionID, rowID) {
    // console.log('renderRow isUnicode', this.state.isUnicode);

    return (
      <View style={styles.row}>
        <Text style={[styles.rowTitle, (this.state.isUnicode ? styles.unicode : styles.zawgyi)]}>
          {rowData.pali}
        </Text>
        <Text
          style={[styles.rowText, (this.state.isUnicode ? styles.unicode : styles.zawgyi)]}>
          {rowData.mm}
        </Text>
      </View>
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
            style={[styles.searchTextInput, (this.state.isUnicode ? styles.unicode : styles.zawgyi)]}
            value={this.state.q}
            onSubmitEditing={this.handleSubmitSearch.bind(this)}
          />
        </View>
        <Switch
          onValueChange={this.handleFontSwitch.bind(this)}
          style={styles.switch}
          value={this.state.isUnicode}
        />
        <Text>{this.state.isUnicode ? 'Unicode (Padauk)' : 'Zawgyi-One'}</Text>
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
  switch: {
    marginBottom: 10
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
  unicode: {
    fontFamily: UNICODE_FONT,
  },
  zawgyi: {
    fontFamily: ZAWGYI_FONT,
  },
});

App.propTypes = propTypes;

export default App;
