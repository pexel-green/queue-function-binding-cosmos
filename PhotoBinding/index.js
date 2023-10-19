const imageHandler = require("../core/ImageResultHandler")

module.exports = async function (context, message) {
    try {
        context.log("Receive request:", JSON.stringify({ id: context.bindingData.id, invocationId: context.bindingData.invocationId, message }))
        const result = imageHandler(message.path, message.data)
        context.bindings.imageAnalysisDocument = result
        context.log("Result:", result)
    } catch ({ err: { response: { data, status } } }) {
        context.log("err", { data, status })
    }
};
