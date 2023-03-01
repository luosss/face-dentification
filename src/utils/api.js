import { post, get } from './http'
 
//登记人脸
export function AddFace(data) {
    return post('/Home/AddFace',data)
}
//人脸对比
export function CompareFace(data) {
    return post('/Home/CompareFace',data)
}
//人脸活体检测
export function DetectLivingFace(data) {
    return post('/Home/DetectLivingFace',data)
}
//人脸核身
export function VerifyIdentityFace(data) {
    return post('/Home/VerifyIdentityFace',data)
}
//考试在线实时检测人脸
export function MonitorExamination(data) {
    return post('/Home/MonitorExamination',data)
}
//考试截图
export function MonitorExaminationByChatTool(data) {
    return post('/Home/MonitorExaminationByChatTool',data)
}
