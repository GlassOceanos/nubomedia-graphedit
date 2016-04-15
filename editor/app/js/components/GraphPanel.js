import React from 'react';
import { connect } from 'react-redux';

import ProjectModal from './ProjectModal';
import NodeModal from './NodeModal';

export default class GraphPanel extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showProjectModal: false, projectEdit: false,
      showNodeModal: false, node: null, initialNode: null, currentNodeName: null
    };
  }

  // Project
  closeProjectModal() {
    this.setState({showProjectModal: false});
    this.props.closeProject();
  }
  projectClickHandler(edit) {
    this.setState({showProjectModal: true, projectEdit: edit});
  }
  setProjectProperties(projectName, packageName) {
    this.setState({showProjectModal: false, projectEdit: false});
    this.props.setProjectProperties(projectName, packageName);
  }

  // Node
  closeNodeModal() {
    Object.keys(this.state.initialNode.props).map(
      (key) => {
        this.state.node.properties[key] = this.state.initialNode.props[key];
      });
    this.setState({showNodeModal: false, node: null});
  }
  nodeClickHandler(editor, node) {
    this.setState({showNodeModal: true, node: node, initialNode: React.cloneElement(node, node.properties), currentNodeName: node.name});
  }
  onDeleteNode() {
    this.props.onDeleteNode(this.state.node);
    this.setState({showNodeModal: false, node: null, initialNode: null, currentNodeName: null});
  }
  onSavePropsNode() {
    if (this.state.currentNodeName != null && this.state.currentNodeName != this.state.node.name) {
      this.state.node.name = this.state.currentNodeName;
      this.setState({node: this.state.node});
    }
    this.setState({showNodeModal: false, node: null, initialNode: null, currentNodeName: null});
  }
  onChangeNodeName(e) {
    this.setState({currentNodeName: e.target.value});
  }
  onChangeNodeProp(e) {
    this.state.node.properties[e.target.name] = e.target.value;
    this.setState({node: this.state.node});
  }

  render() {
    let projectmodal = null;
    let nodemodal    = null;
    if (this.state.showProjectModal) {
      projectmodal =
        <ProjectModal editor={this.props.editor}
          projectEdit={this.state.projectEdit}
          closeProjectModal={this.closeProjectModal.bind(this)}
          setProjectProperties={this.setProjectProperties.bind(this)}
        />
    }
    if (this.state.showNodeModal) {
      nodemodal =
        <NodeModal
          node={this.state.node}
          currentNodeName={this.state.currentNodeName}
          nodedefs={this.props.nodedefs}
          onDeleteNode={this.onDeleteNode.bind(this)}
          closeNodeModal={this.closeNodeModal.bind(this)}
          onSavePropsNode={this.onSavePropsNode.bind(this)}
          onChangeNodeName={this.onChangeNodeName.bind(this)}
          onChangeNodeProp={this.onChangeNodeProp.bind(this)}
        />;
    }
    return (
      <div id="graphpanel" className="panel panel-default" style={{height:"600px",width:"100%"}}>
        <div className="demo nuboged" ref="editor_panel" id="nuboged-container" >
        </div>
        {projectmodal}
        {nodemodal}
      </div>
    );
  }
  // Can't use callback ref because a dynamic callback (needed to use 'this') gets fired every update
  componentDidMount() {
    this.props.onSetEditorPanel(this.refs.editor_panel, this.projectClickHandler.bind(this), this.nodeClickHandler.bind(this));
  }
  componentWillUnmount() {
    this.props.onSetEditorPanel(null);
  }
}
