import {Descriptions} from "antd";
import React from "react";

function ShowMemberOrderInfoDetail({orders}) {

    return (
        <Descriptions style={{marginBottom: 20}} bordered>
            <Descriptions.Item label='회원 아이디'>
                <>{orders}</>
            </Descriptions.Item>
        </Descriptions>
    );
}

export default ShowMemberOrderInfoDetail;