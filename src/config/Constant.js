
//Status User
const pendingApproval = "PENDING_APPROVAL";
const active = "ACTIVE";
const pendingDelete = "PENDING_DELETE";
const inactive = "INACTIVE";
const disabled = "DISABLED";
const expired = "EXPIRED";
const lock = "LOCKED";
const expiredPass = "EXPIRED_PASSWORD";
const userLoggin = () => sessionStorage.getItem('userId');
const getToken = () => sessionStorage.getItem('accessToken');
const getIdForm = () => sessionStorage.getItem('idForm');
const getBranch = () => sessionStorage.getItem('branch');
const token = sessionStorage.getItem('accessToken')
const idUser = sessionStorage.getItem('id');
const verified = "VERIFIED";
const approved = "APPROVED";
const reject = "REJECT";
const rework = "REWORK";
const pending = "PENDING";
const unauthorized = "UNAUTHORIZED";

module.exports = { pending,rework,verified,approved,reject,pendingApproval,unauthorized, active,pendingDelete,inactive,disabled,expired,lock,userLoggin,token,expiredPass,idUser, getToken,getIdForm,getBranch };