module.exports = (imagePath, { categories, color, imageType, tags, description, objects, brands }) => {
    return JSON.stringify({
        id: base64EncodeURI(imagePath),
        imagePath,
        categories: categoriesHandler(categories),
        color: colorHandler(color),
        imageType: imageTypeHandler(imageType),
        tags: tagsHandler(tags),
        description: descriptionHandler(description),
        objects: objectsHandler(objects),
        brands: brandsHandler(brands)
    })
}

function base64EncodeURI(text) {
    var binary = decodeURIComponent(encodeURIComponent(text));
    var base64 = btoa(binary);
    return base64;
}

function categoriesHandler(categories) {
    const result = "others_"
    if (categories.length === 0) {
        return result
    }
    if (categories.length === 1) {
        return categories[0].name
    }
    return categories.sort((a, b) => b.score - a.score)[0].name
}

function colorHandler(color) {
    if (color.isBwImg) {
        return process.env.IS_BW_IMG
    }
    return color.dominantColors.join(",")
}

function imageTypeHandler({ clipArtType, lineDrawingType }) {
    const result = ""
    if (clipArtType) {
        result += "clipArt"
    }
    if (lineDrawingType) {
        result += "lineDrawing"
    }
    return result
}
function tagsHandler(tags) {
    return tags.filter(t => t.confidence > parseFloat(process.env.TAG_CONFIDENCE_THRESHOLD)).map(i => i.name).join(",")
}
function descriptionHandler({ tags, captions }) {
    return {
        tags: tags.join(","),
        captions: captions.filter(c => c.confidence > parseFloat(process.env.CAPTION_CONFIDENCE_THRESHOLD)).map(c => c.text).join(",")
    }
}
function objectsHandler(objects) {
    return objects.filter(o => o.confidence > parseFloat(process.env.OBJECT_CONFIDENCE_THRESHOLD)).map(o => o.object).join(",")
}
function brandsHandler(brands) {
    return brands.filter(b => b.confidence > parseFloat(process.env.BRAND_CONFIDENCE_THRESHOLD)).map(b => b.name).join(",")
}