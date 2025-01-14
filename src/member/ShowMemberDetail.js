import {Layout, theme} from "antd";
import axios from "axios";
import {useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import type {Member} from "../CommonInterface";
import {getResult} from "../AxiosResponse";
const { Content } = Layout;

function ShowMemberDetail() {
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();

    // 파라미터 memberId
    const { memId } = useParams();
    const [loading, setLoading] = useState(true);
    const [result, setResult] = useState(null);

    useEffect(() => {
        axios.get(`/member-proxy/member/v1/members/${memId}`)
            .then(response => {
                const result:Member = response.data;
                setResult(result);
                setLoading(false);
            })
            .catch(error => {
                console.error("데이터 조회시 에러가 발생했습니다. Error : ", error);
                getResult(error.response, "회원 정보 조회시 에러가 발생했습니다. 잠시 후 다시 시도해주세요.");
                setLoading(false);
                window.close();
            });
    }, [memId]);
}

export default ShowMemberDetail;