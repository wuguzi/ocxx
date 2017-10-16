/*
 * @Author: puxiao.wh 
 * @Date: 2017-07-23 17:05:52 
 * @Last Modified by: puxiao.wh
 * @Last Modified time: 2017-10-16 01:39:04
 */
const {
    success,
    fail
} = require('../utils/returnUtil')
const daoOfficial = require('../dao/official')
const daoOfficialInfo = require('../dao/officialInfo')
const daoOfficialDynamic = require('../dao/officialDynamic')
const serviceOfficialUser = require('../service/officialUser')
const serviceOfficialDynamic = require('../service/officialDynamic')
const loops = require('../utils/loops')

exports.getOfficialInfo = async(options) => {
    const { officialId } = options
    let dataOfficial = await daoOfficial.get({
        _id: officialId,
        isShow: true,
        isActive: true,
        isDelete: false
    }, {
        isActive: 0,
        isShow: 0,
        isDelete: 0
    })

    if(dataOfficial) {
        dataOfficial = dataOfficial[0]
        dataOfficial.officialId = dataOfficial._id
        delete dataOfficial._id
        return dataOfficial
    }
    return undefined
}

exports.getOfficialList = async(options) => {
    const { wxSessionCode, circleId } = options
    try {
        // 获取用户信息
        const dataUser = await serviceOfficialUser.getUserInfo({
            wxSessionCode
        })
        // 获取官方信息
        const dataOfficialList = await daoOfficial.get({
            circleId,
            isShow: true,
            isActive: true,
            isDelete: false
        }, {
            isActive: 0,
            isDelete: 0,
            isShow: 0
        }, {
            create: 1
        })

        // 格式化官方列表
        let _dataOfficialList = undefined
        if(dataOfficialList) {
            _dataOfficialList = loops.getNewArray(dataOfficialList, (dataOfficialItem, i) => {
                dataOfficialItem.isOfficialFocus = false
                if(dataUser) {
                    const dataOfficialFocus = serviceOfficialDynamic.getOfficialFocus({
                        userId: dataUser.userId,
                        officialId: dataOfficialItem._id
                    })
                    dataOfficialItem.isOfficialFocus = !!dataOfficialFocus
                }

                dataOfficialItem.officialId = dataOfficialItem._id
                
                delete dataOfficialItem._id
                return dataOfficialItem
            })
        }

        return _dataOfficialList
    } catch(e) {
        console.error(e)
    }
    return undefined
}

exports.getMapOfficialList = async(qeury, find) => {
    try {
        let dataOfficialList = await daoOfficial.get({
            isShow: true,
            isActive: true,
            isDelete: false
        }, {
            officialName: 1,
            officialPic: 1
        }, {
            create: -1
        })
        let _dataOfficialList = undefined
        if(dataOfficialList) {
            _dataOfficialList = loops.getNewArray(dataOfficialList, (dataOfficialItem, i) => {
                dataOfficialItem.officialId = dataOfficialItem._id
                delete dataOfficialItem._id
                return dataOfficialItem
            })
        }
        return _dataOfficialList
    } catch(e) {
        console.error(e)
    }
    return undefined
}

exports.getOfficialInfoList = async(options) => {
    try {
        let officialData = await daoOfficial.get({
            _id: options.officialId,
            isShow: true,
            isActive: true
        }, {
            create: 1,
            officialName: 1,
            officialDes: 1,
            officialFullSupport: 1,
            officialFocus: 1,
            officialPic: 1
        })
        
        let officialInfoList = await daoOfficialInfo.get({
            officialId: options.officialId,
            isShow: true,
            isActive: true
        })

        return await success({
            msg: 'getOfficialInfoList',
            data: {
                success: true,
                official: officialData,
                officialInfoCount: officialInfoList.length,
                officialInfoList: officialInfoList
            }
        })
    } catch(e) {
        console.error(e)
    }
    return fail({
        msg: 'getOfficialInfoList',
        data: {
            success: false,
            official: {},
            officialInfoCount: 0,
            officialInfoList: []
        }
    })
}