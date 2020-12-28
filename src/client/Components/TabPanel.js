import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Today from './Today'

function TabContainer(props) {
  return (
    <Typography {...props} component="div" style={{ padding: 8 * 3 }}>
      {props.children}
    </Typography>
  );
}

TabContainer.propTypes = {
  children: PropTypes.node.isRequired,
};

const styles = theme => ({
  root: {
    flexGrow: 1,
    marginTop: theme.spacing(3),
    backgroundColor: theme.palette.background.paper,
  },
});

class TabPanel extends React.Component {
  state = {
    activeTabIndex: 0,
  };

  handleChange = (event, value) => {
    this.setState({ activeTabIndex: value });
  };

  render() {
    const { classes } = this.props;
    const { activeTabIndex } = this.state;

    return (
      // <div className={classes.root}>
      //   <AppBar position="static">
      //     <Tabs value={activeTabIndex} onChange={this.handleChange}>
      //       <Tab label="Today" />
      //       <Tab label="Tab Two" />
      //       <Tab label="Tab Three" />
      //     </Tabs>
      //   </AppBar>
      //   {
      //     activeTabIndex === 0 &&
      //     // When the user clicks on Test One or Test Two, update the state
      //     // to display Tab 2
      //     <div onClick={() => this.setState({ activeTabIndex: 1 })}>
      //       <TabContainer >
      //         <Today />
      //       </TabContainer>
      //     </div>
      //   }
      //   {
      //     activeTabIndex === 1 &&
      //     <div>
      //       <TabContainer>
      //         Test 2
      //       </TabContainer>
      //     </div>
      //   }
      //   {
      //     activeTabIndex === 2 &&
      //     <div>
      //       <TabContainer>
      //         Test 3
      //       </TabContainer>
      //     </div>
      //   }
      // </div>
      <Today />
    );
  }
}

TabPanel.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(TabPanel);