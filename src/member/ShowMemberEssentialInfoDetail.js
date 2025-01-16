import {Form, Descriptions, Button} from "antd";
import React from "react";

function ShowMemberEssentialInfoDetail({member}) {

    // 비밀번호 초기화 수행
    const onResetPassword = async () => {
        console.log("onResetPassword");
        // todo
    }

    return (
        <Form id={'mem-detail-form'}>
            <Descriptions style={{marginBottom: 20}} bordered>
                <Descriptions.Item label='회원 아이디'>
                    <>{member.id}</>
                </Descriptions.Item>
                <Descriptions.Item label='회원명'>
                    <>{member.name}</>
                </Descriptions.Item>
                <Descriptions.Item label='회원 닉네임'>
                    <>{member.nickname}</>
                </Descriptions.Item>
                <Descriptions.Item label='비밀번호'>
                    <Button onClick={onResetPassword}>비밀번호 초기화</Button>
                </Descriptions.Item>
                <Descriptions.Item label='가입 일시'>
                    <>{member.joinDate}</>
                </Descriptions.Item>
                <Descriptions.Item label='탈퇴 일시'>
                    <>{member.withdrawalDate}</>
                </Descriptions.Item>
                <Descriptions.Item label={(<span>탈퇴 회원 정보<br />삭제 잔여 기간</span>)}>
                    <>{member.leftDateToDiscardMemberInfo}</>
                </Descriptions.Item>
                <Descriptions.Item label='전화번호' span={1.5}>
                    <>{member.phoneNum}</>
                </Descriptions.Item>
                <Descriptions.Item label='생년월일' span={1.5}>
                    <>{member.birthDate}</>
                </Descriptions.Item>
                <Descriptions.Item label='이메일' span={1.5}>
                    <>{member.email}</>
                </Descriptions.Item>
                <Descriptions.Item label='이메일 수신 동의 여부' span={1.5}>
                    <>{member.isEmailReceiveAgree ? '동의함' : '동의 안함'}</>
                </Descriptions.Item>
                <Descriptions.Item label='회원 포인트'>
                    <>{member.point}</>
                </Descriptions.Item>
            </Descriptions>
        </Form>
    );
}

export default ShowMemberEssentialInfoDetail;
