import React, { Component } from 'react';
import { TouchableOpacity, RefreshControl, View, Text, Alert, ScrollView, Image } from 'react-native';
import config from '../config';
import styles from "../css/mainStyle"
require('firebase/firestore');
import { Table, TableWrapper, Row, Cell } from 'react-native-table-component';
console.disableYellowBox = true;
export default class ApproveUser extends Component {
    state = {
        tableHead: ['Shop Name', 'Phone Number', 'Action'],
        tableData: [
        ],
        loading: false,
        totalUsers: 0
    }
    async  componentDidMount() {
        this.loadEverything();
    }
    ConfirmDelete = async (documentId) => {
        Alert.alert(
            "Delete User",
            "Do you really want to delete this User?",
            [
                {
                    text: "Yes",
                    onPress: () => this.deleteUser(documentId)
                },
                { text: "No", onPress: () => console.log("OK") }
            ]
        );

    }
    deleteUser = async (data) => {
        this.setState({ loading: true });
        const documentId = data.substring(data.indexOf(',') + 1);
        config.shared.fireS.collection("user-info").doc(documentId).delete().then(doc => {
            this.loadEverything();
        }).catch(function (error) {
            console.error("Error removing document: ", error);
            this.setState({ loading: false });
        });
    }
    loadEverything = () => {
        this.setState({ loading: true });
        let ref = config.shared.fireS.collection("user-info").orderBy("joiningDate", "desc").where("admin", "==", false);
        ref.get()
            .then(snapshot => {
                if (!snapshot.empty) {
                    const users = []
                    snapshot.forEach(doc => {
                        const { storeName, phoneNo, approved } = doc.data();
                        users.push([
                            storeName,
                            phoneNo,
                            approved + "," + phoneNo
                        ]);
                    })
                    // console.log(users);
                    this.setState({ totalUsers: snapshot.docs.length });
                    this.setState({ tableData: users });
                }
                this.setState({ loading: false });
            })
            .catch(error => console.log(error))
    }
    _onRefresh = () => this.loadEverything();

    async approve_unApprove(data) {
        this.setState({ loading: true });
        const documentId = data.substring(data.indexOf(',') + 1);
        const approved = data.substring(0, data.indexOf(',')) == "true" ? false : true;
        await config.shared.fireS.collection("user-info").doc(documentId).update({
            approved: approved
        }).then(d => {
            this.loadEverything();
        });
    }

    render() {
        const state = this.state;
        const element = (data, index) => (
            <View style={{marginLeft:10, flexDirection:'row'}}>
                <TouchableOpacity onPress={() => this.approve_unApprove(data)}>
                     <Image
                      source={data.substring(0, data.indexOf(',')) == "true" ? require('../../assets/unapprove.png') : require('../../assets/approve.png')}
                      style={styles.ImageIconStyle}
                    />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => this.ConfirmDelete(data)}>
                <Image
                      source={require('../../assets/delete.jpg')}
                      style={styles.ImageIconStyle}
                    />
                </TouchableOpacity>
            </View>
        );

        return (
            <View style={styles.containerTable}>
                <Text style={{ fontSize: 18, marginBottom: 10, alignSelf: 'center' }}>Total Users: {state.totalUsers}</Text>
                <Table>
                    <Row data={state.tableHead} style={styles.tableHead} textStyle={styles.tableTextHead} />
                </Table>
                <ScrollView refreshControl={
                    <RefreshControl
                        refreshing={this.state.loading}
                        onRefresh={this._onRefresh} />
                }>
                    <Table>
                        {
                            state.tableData.map((rowData, index) => (
                                <TableWrapper key={index} style={styles.tableRow}>
                                    {
                                        rowData.map((cellData, cellIndex) => (
                                            <Cell key={cellIndex} data={cellIndex === 2 ? element(cellData, index) : cellData} textStyle={styles.tableText} />
                                        ))
                                    }
                                </TableWrapper>
                            ))
                        }
                    </Table>
                </ScrollView>
            </View>
        )
    }
}