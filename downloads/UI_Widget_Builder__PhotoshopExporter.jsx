// UI Widget Builder — Photoshop PSD Exporter
// Single file: no external dependencies needed.
// Run via: File > Scripts > Browse… and select this file.
#target photoshop

// ════════════════════════════════════════════════════════════════
//  UI WIDGET BUILDER PSD EXPORTER
// ════════════════════════════════════════════════════════════════
var identicalTextureGroups = {};
var UIWB_PROJECT_AUTHOR_NAME = "Ali Shantia";
var UIWB_PROJECT_LINKEDIN_URL = "https://www.linkedin.com/in/ali-shantia";
var UIWB_PROJECT_DOCS_URL = "https://drive.google.com/file/d/1FS2_d8NWipDHEBIYCdBU1R8wQIid9Yuz/view?usp=drive_link";
var UIWB_PROJECT_STORE_URL = "https://www.fab.com/sellers/Ali%20Shantia%28Sepinood%29";
var UIWB_PROJECT_YOUTUBE_URL = "https://www.youtube.com/results?search_query=UI+Widget+Builder";
var UIWB_EXPORT_PREFS_KEY = stringIDToTypeID("UIWidgetBuilder_PSDExporter_Options");
var UIWB_EXPORT_PREFS_PATH_KEY = stringIDToTypeID("exportPath");
var UIWB_EXPORT_PREFS_REMEMBER_PATH_KEY = stringIDToTypeID("rememberPath");
var UIWB_EXPORT_PREFS_SKIP_VISIBLE_KEY = stringIDToTypeID("skipVisible");
var UIWB_EXPORT_PREFS_SKIP_EXISTING_KEY = stringIDToTypeID("skipExisting");
var UIWB_EXPORT_PREFS_DELETE_EXISTING_KEY = stringIDToTypeID("deleteExisting");
var UIWB_EXPORT_PREFS_SHOW_WARN_KEY = stringIDToTypeID("showWarning");
var UIWB_EXPORT_PREFS_OPEN_FOLDER_KEY = stringIDToTypeID("openFolder");
var UIWB_EXPORT_PREFS_SOLID_COLOR_KEY = stringIDToTypeID("solidColor");
var UIWB_EXPORT_PREFS_AUTOFILL_BTN_STATES_KEY = stringIDToTypeID("autoFillBtnStates");

function getUIWBDefaultExportPrefs() {
    return {
        exportPath: "",
        rememberPath: false,
        skipVisible: true,
        skipExisting: false,
        deleteExisting: false,
        showWarning: true,
        openFolder: false,
        solidColor: false,
        autoFillBtnStates: false
    };
}

function getUIWBExportPrefsSettingsFile() {
    try {
        var settingsFolder = new Folder(Folder.userData.fsName + "/UIWidgetBuilder");
        if (!settingsFolder.exists && !settingsFolder.create()) {
            return null;
        }
        return new File(settingsFolder.fsName + "/PSDExporterPrefs.txt");
    } catch (settingsFileError) {
        return null;
    }
}

function uiwbParseBool(value) {
    return value === true || value === 1 || value === "1" || value === "true" || value === "TRUE";
}

function uiwbDecodeText(value) {
    try { return decodeURIComponent(value); } catch (decodeError) { return value; }
}

function uiwbEncodeText(value) {
    try { return encodeURIComponent(value); } catch (encodeError) { return value; }
}

function loadUIWBExportPrefs() {
    var prefs = getUIWBDefaultExportPrefs();

    try {
        var options = app.getCustomOptions(UIWB_EXPORT_PREFS_KEY);
        if (options.hasKey(UIWB_EXPORT_PREFS_PATH_KEY)) prefs.exportPath = options.getString(UIWB_EXPORT_PREFS_PATH_KEY).replace(/^\s+|\s+$/g, "");
        if (options.hasKey(UIWB_EXPORT_PREFS_REMEMBER_PATH_KEY)) prefs.rememberPath = options.getBoolean(UIWB_EXPORT_PREFS_REMEMBER_PATH_KEY);
        if (options.hasKey(UIWB_EXPORT_PREFS_SKIP_VISIBLE_KEY)) prefs.skipVisible = options.getBoolean(UIWB_EXPORT_PREFS_SKIP_VISIBLE_KEY);
        if (options.hasKey(UIWB_EXPORT_PREFS_SKIP_EXISTING_KEY)) prefs.skipExisting = options.getBoolean(UIWB_EXPORT_PREFS_SKIP_EXISTING_KEY);
        if (options.hasKey(UIWB_EXPORT_PREFS_DELETE_EXISTING_KEY)) prefs.deleteExisting = options.getBoolean(UIWB_EXPORT_PREFS_DELETE_EXISTING_KEY);
        if (options.hasKey(UIWB_EXPORT_PREFS_SHOW_WARN_KEY)) prefs.showWarning = options.getBoolean(UIWB_EXPORT_PREFS_SHOW_WARN_KEY);
        if (options.hasKey(UIWB_EXPORT_PREFS_OPEN_FOLDER_KEY)) prefs.openFolder = options.getBoolean(UIWB_EXPORT_PREFS_OPEN_FOLDER_KEY);
        if (options.hasKey(UIWB_EXPORT_PREFS_SOLID_COLOR_KEY)) prefs.solidColor = options.getBoolean(UIWB_EXPORT_PREFS_SOLID_COLOR_KEY);
        if (options.hasKey(UIWB_EXPORT_PREFS_AUTOFILL_BTN_STATES_KEY)) prefs.autoFillBtnStates = options.getBoolean(UIWB_EXPORT_PREFS_AUTOFILL_BTN_STATES_KEY);
    } catch (customOptionsReadError) {}

    var settingsFile = getUIWBExportPrefsSettingsFile();
    if (settingsFile && settingsFile.exists) {
        try {
            settingsFile.encoding = "UTF8";
            if (settingsFile.open("r")) {
                var lines = settingsFile.read().split(/\r?\n/);
                settingsFile.close();
                for (var i = 0; i < lines.length; i++) {
                    var line = lines[i];
                    if (!line) { continue; }
                    var eq = line.indexOf("=");
                    if (eq < 0) { continue; }
                    var key = line.substring(0, eq);
                    var raw = line.substring(eq + 1);
                    if (key === "exportPath") prefs.exportPath = uiwbDecodeText(raw);
                    else if (key === "rememberPath") prefs.rememberPath = uiwbParseBool(raw);
                    else if (key === "skipVisible") prefs.skipVisible = uiwbParseBool(raw);
                    else if (key === "skipExisting") prefs.skipExisting = uiwbParseBool(raw);
                    else if (key === "deleteExisting") prefs.deleteExisting = uiwbParseBool(raw);
                    else if (key === "showWarning") prefs.showWarning = uiwbParseBool(raw);
                    else if (key === "openFolder") prefs.openFolder = uiwbParseBool(raw);
                    else if (key === "solidColor") prefs.solidColor = uiwbParseBool(raw);
                    else if (key === "autoFillBtnStates") prefs.autoFillBtnStates = uiwbParseBool(raw);
                }
            }
        } catch (readSettingsError) {
            try { settingsFile.close(); } catch (closeReadError) {}
        }
    }

    if (!prefs.rememberPath) {
        prefs.exportPath = "";
    }

    return prefs;
}

function saveUIWBExportPrefs(prefs) {
    var cleanPrefs = prefs || getUIWBDefaultExportPrefs();
    if (!cleanPrefs.rememberPath) {
        cleanPrefs.exportPath = "";
    } else {
        cleanPrefs.exportPath = (cleanPrefs.exportPath || "").replace(/^\s+|\s+$/g, "");
    }

    var customOptionsSaved = false;
    try {
        var options = new ActionDescriptor();
        options.putString(UIWB_EXPORT_PREFS_PATH_KEY, cleanPrefs.exportPath || "");
        options.putBoolean(UIWB_EXPORT_PREFS_REMEMBER_PATH_KEY, !!cleanPrefs.rememberPath);
        options.putBoolean(UIWB_EXPORT_PREFS_SKIP_VISIBLE_KEY, !!cleanPrefs.skipVisible);
        options.putBoolean(UIWB_EXPORT_PREFS_SKIP_EXISTING_KEY, !!cleanPrefs.skipExisting);
        options.putBoolean(UIWB_EXPORT_PREFS_DELETE_EXISTING_KEY, !!cleanPrefs.deleteExisting);
        options.putBoolean(UIWB_EXPORT_PREFS_SHOW_WARN_KEY, !!cleanPrefs.showWarning);
        options.putBoolean(UIWB_EXPORT_PREFS_OPEN_FOLDER_KEY, !!cleanPrefs.openFolder);
        options.putBoolean(UIWB_EXPORT_PREFS_SOLID_COLOR_KEY, !!cleanPrefs.solidColor);
        options.putBoolean(UIWB_EXPORT_PREFS_AUTOFILL_BTN_STATES_KEY, !!cleanPrefs.autoFillBtnStates);
        app.putCustomOptions(UIWB_EXPORT_PREFS_KEY, options, true);
        customOptionsSaved = true;
    } catch (customOptionsWriteError) {}

    var settingsFile = getUIWBExportPrefsSettingsFile();
    if (!settingsFile) {
        return customOptionsSaved;
    }

    try {
        settingsFile.encoding = "UTF8";
        if (!settingsFile.open("w")) {
            return customOptionsSaved;
        }
        settingsFile.write(
            "exportPath=" + uiwbEncodeText(cleanPrefs.exportPath || "") + "\n" +
            "rememberPath=" + (cleanPrefs.rememberPath ? "1" : "0") + "\n" +
            "skipVisible=" + (cleanPrefs.skipVisible ? "1" : "0") + "\n" +
            "skipExisting=" + (cleanPrefs.skipExisting ? "1" : "0") + "\n" +
            "deleteExisting=" + (cleanPrefs.deleteExisting ? "1" : "0") + "\n" +
            "showWarning=" + (cleanPrefs.showWarning ? "1" : "0") + "\n" +
            "openFolder=" + (cleanPrefs.openFolder ? "1" : "0") + "\n" +
            "solidColor=" + (cleanPrefs.solidColor ? "1" : "0") + "\n" +
            "autoFillBtnStates=" + (cleanPrefs.autoFillBtnStates ? "1" : "0") + "\n"
        );
        settingsFile.close();
        return true;
    } catch (writeSettingsError) {
        try { settingsFile.close(); } catch (closeWriteError) {}
        return customOptionsSaved;
    }
}

function resetUIWBExportPrefs() {
    return saveUIWBExportPrefs(getUIWBDefaultExportPrefs());
}

// ── Cancel flag ──────────────────────────────────────────────────────────────
var UIWB_THEME = {
    windowBg: [0.12, 0.12, 0.12, 1.0],
    panelBg: [0.18, 0.18, 0.18, 1.0],
    groupBg: [0.14, 0.14, 0.14, 1.0],
    fieldBg: [0.24, 0.24, 0.24, 1.0],
    buttonBg: [0.22, 0.22, 0.22, 1.0],
    buttonAccent: [0.96, 0.58, 0.18, 1.0],
    buttonAccentSoft: [0.40, 0.24, 0.10, 1.0],
    textPrimary: [0.94, 0.94, 0.94, 1.0],
    textMuted: [0.74, 0.74, 0.74, 1.0]
};

function uiwbMakeBrush(graphics, color) {
    return graphics.newBrush(graphics.BrushType.SOLID_COLOR, color);
}

function uiwbSetBg(control, color) {
    try {
        if (control && control.graphics) {
            control.graphics.backgroundColor = uiwbMakeBrush(control.graphics, color);
        }
    } catch (bgErr) {}
}

function uiwbSetFg(control, color) {
    try {
        if (control && control.graphics) {
            control.graphics.foregroundColor = uiwbMakeBrush(control.graphics, color);
        }
    } catch (fgErr) {}
}

function uiwbInstallOrangeButtonChrome(button) {
    if (!button || button._uiwbOrangeChromeInstalled) {
        return;
    }

    button._uiwbOrangeChromeInstalled = true;
    button._uiwbButtonState = "normal";

    var setButtonState = function (state) {
        button._uiwbButtonState = state;
        try { button.notify("onDraw"); } catch (notifyErr) {}
        try {
            if (button.parent && button.parent.layout) {
                button.parent.layout.layout(true);
            }
        } catch (layoutErr) {}
        try {
            if (button.window) {
                button.window.update();
            }
        } catch (windowErr) {}
    };

    try { button.addEventListener("mouseover", function () { setButtonState("hover"); }); } catch (e1) {}
    try { button.addEventListener("mouseout", function () { setButtonState("normal"); }); } catch (e2) {}
    try { button.addEventListener("mousedown", function () { setButtonState("pressed"); }); } catch (e3) {}
    try { button.addEventListener("mouseup", function () { setButtonState("hover"); }); } catch (e4) {}

    button.onDraw = function () {
        var g = this.graphics;
        var state = this._uiwbButtonState || "normal";
        var label = this.text || "";
        var bg = state === "pressed"
            ? [0.98, 0.50, 0.10, 1.0]
            : state === "hover"
                ? [0.96, 0.60, 0.18, 1.0]
                : UIWB_THEME.buttonBg;
        var border = state === "normal"
            ? [0.35, 0.35, 0.35, 1.0]
            : [0.98, 0.58, 0.16, 1.0];
        var fg = [0.96, 0.96, 0.96, 1.0];

        try {
            g.backgroundColor = uiwbMakeBrush(g, bg);
            g.drawOSControl();
        } catch (drawErr) {}

        try {
            var pen = g.newPen(g.PenType.SOLID_COLOR, border, 1);
            g.newPath();
            g.rectPath(0, 0, this.size.width - 1, this.size.height - 1);
            g.strokePath(pen);
        } catch (borderErr) {}

        try {
            var textBrush = uiwbMakeBrush(g, fg);
            var textFont = ScriptUI.newFont("Arial", "REGULAR", 10);
            var textSize = g.measureString(label, textFont);
            var textX = Math.max(6, Math.round((this.size.width - textSize[0]) * 0.5));
            var textY = Math.max(4, Math.round((this.size.height + textSize[1]) * 0.5) - 2);
            g.font = textFont;
            g.drawString(label, textFont, textBrush, textX, textY);
        } catch (textErr) {}
    };
}

function uiwbThemeControl(control) {
    if (!control) {
        return;
    }

    var kind = "";
    var label = "";
    try { kind = (control.type || "").toString().toLowerCase(); } catch (kindErr) {}
    try { label = (control.text || "").toString(); } catch (labelErr) {}

    if (kind === "window" || kind === "dialog" || kind === "palette") {
        uiwbSetBg(control, UIWB_THEME.windowBg);
    } else if (kind === "panel") {
        uiwbSetBg(control, UIWB_THEME.panelBg);
    } else if (kind === "edittext" || kind === "dropdownlist") {
        uiwbSetBg(control, UIWB_THEME.fieldBg);
        uiwbSetFg(control, UIWB_THEME.textPrimary);
    } else if (kind === "button") {
    // Remove custom orange chrome to fix missing text & flicker
    // uiwbInstallOrangeButtonChrome(control);
    // Use standard Photoshop button appearance:
    uiwbSetBg(control, UIWB_THEME.buttonBg);
    uiwbSetFg(control, UIWB_THEME.textPrimary);
} else if (kind === "statictext" || kind === "checkbox") {
        if (/defaults to|remember|license/i.test(label)) {
            uiwbSetFg(control, UIWB_THEME.textMuted);
        } else {
            uiwbSetFg(control, UIWB_THEME.textPrimary);
        }
    }

    try {
        if (control.children && control.children.length) {
            for (var i = 0; i < control.children.length; i++) {
                uiwbThemeControl(control.children[i]);
            }
        }
    } catch (childErr) {}
}

function uiwbApplyImporterTheme(rootControl) {
    uiwbThemeControl(rootControl);
}

var _exportCancelled = false;

// ── Progress window ──────────────────────────────────────────────────────────
// NOTE: The progress window is a top-level palette shown AFTER the main dialog
// closes. This is intentional — ScriptUI cannot update palette windows while a
// modal dialog is blocking the event loop, so we close the menu dialog first,
// run the export with the progress palette visible, then re-show the menu.
var _progressWin   = null;
var _progressBar   = null;
var _progressLabel = null;
var _cancelBtn     = null;

function showProgressWindow(title, total) {
    _exportCancelled = false;

    _progressWin = new Window("palette", title, undefined, {closeButton: false});
    _progressWin.orientation   = "column";
    _progressWin.alignChildren = ["fill", "center"];
    _progressWin.margins       = [16, 14, 16, 14];
    _progressWin.spacing       = 8;
    _progressWin.preferredSize = [400, -1];

    var lbl = _progressWin.add("statictext", undefined, "Preparing\u2026");
    lbl.preferredSize = [370, 18];
    lbl.graphics.font = ScriptUI.newFont("Arial", "REGULAR", 10);
    _progressLabel = lbl;

    var bar = _progressWin.add("progressbar", [0, 0, 370, 16], 0, Math.max(total, 1));
    _progressBar = bar;

    var row = _progressWin.add("group");
    row.orientation   = "row";
    row.alignChildren = ["right", "center"];
    row.alignment     = ["fill", "center"];

    var btn = row.add("button", undefined, "Cancel");
    btn.preferredSize = [80, 26];
    btn.onClick = function () {
        _exportCancelled = true;
        btn.enabled = false;
        _progressLabel.text = "Cancelling \u2014 finishing current texture\u2026";
        _progressWin.update();
    };
    _cancelBtn = btn;

    _progressWin.center();
    _progressWin.show();
    _progressWin.update();
    app.refresh();
}

function updateProgress(current, total, layerName) {
    if (!_progressWin) return;
    _progressBar.value    = current;
    _progressBar.maxvalue = Math.max(total, 1);
    if (!_exportCancelled) {
        _progressLabel.text = "(" + current + "/" + total + ")  " + layerName;
    }
    _progressWin.update();
    app.refresh();
}

function closeProgressWindow() {
    if (_progressWin) {
        try { _progressWin.close(); } catch (e) {}
        _progressWin  = null;
        _progressBar  = null;
        _progressLabel = null;
        _cancelBtn    = null;
    }
}

function openExternalUrl(url)
{
    if (!url) {
        return;
    }

    function tryExecuteUrlShortcut(targetUrl)
    {
        try {
            var tempFolder = Folder.temp ? Folder.temp : Folder.userData;
            if (!tempFolder) {
                return false;
            }

            var shortcutFile = new File(tempFolder.fsName + "/UIWidgetBuilder_OpenLink.url");
            shortcutFile.encoding = "UTF8";

            if (!shortcutFile.open("w")) {
                return false;
            }

            shortcutFile.write("[InternetShortcut]\r\nURL=" + targetUrl + "\r\n");
            shortcutFile.close();
            return shortcutFile.execute();
        } catch (shortcutErr) {
            return false;
        }
    }

    try {
        var opened = false;

        try {
            opened = (new File(url)).execute();
        } catch (fileErr) {
            opened = false;
        }

        if (!opened) {
            var isWindows = ($.os && $.os.toLowerCase().indexOf("windows") >= 0);
            if (isWindows) {
                try {
                    system.callSystem('cmd /c start "" "' + url.replace(/&/g, '^&') + '"');
                    opened = true;
                } catch (cmdErr) {
                    opened = false;
                }
            }
            else {
                try {
                    system.callSystem('open "' + url + '"');
                    opened = true;
                } catch (openErr) {
                    opened = false;
                }
            }
        }

        if (!opened) {
            opened = tryExecuteUrlShortcut(url);
        }

        if (!opened) {
            throw new Error("Unable to launch external URL.");
        }
    } catch (e) {
        alert("Could not open link:\n" + url);
    }
}

// ============================================================================
// AUTO-FILL MISSING BUTTON STATES (JSON only, no layer creation)
// ============================================================================
var autoFillBtnStates = false;

function runExporter(preselectedFolder, skipExisting, solidColorOpt, autoFillStatesOpt) {
if (!app.documents.length) {
    alert("Open a PSD first.");
    return;
}

var doc = app.activeDocument;
var autoFillBtnStates = (autoFillStatesOpt === true);
var outFolder = preselectedFolder ? new Folder(preselectedFolder) : Folder.selectDialog("Choose export folder");
if (!outFolder) return;

// Overwrite check
var jsonFile_check = new File(outFolder.fsName + "/layout.json");
var texFolder_check = new Folder(outFolder.fsName + "/Textures");
var hasExisting = jsonFile_check.exists || texFolder_check.exists;
if (hasExisting && skipExisting === undefined) {
    var go = confirm("Existing export found in:\n" + outFolder.fsName + "\n\nlayout.json: " + (jsonFile_check.exists ? "exists" : "not found") + "\nTextures/:   " + (texFolder_check.exists ? "exists" : "not found") + "\n\nClick OK to overwrite changed files (existing textures that are not re-exported will be kept).\nClick Cancel to abort.");
    if (!go) return;
}

var texFolder = new Folder(outFolder.fsName + "/Textures");
if (!texFolder.exists) texFolder.create();

var oldRulerUnits = app.preferences.rulerUnits;
app.preferences.rulerUnits = Units.PIXELS;

function px(unitValue) {
    return Number(unitValue.as("px"));
}

function escapeJsonString(str) {
    if (str === null || str === undefined) return "";
    str = String(str);
    str = str.replace(/\\/g, "\\\\");
    str = str.replace(/"/g, "\\\"");
    str = str.replace(/\r/g, "\\r");
    str = str.replace(/\n/g, "\\n");
    str = str.replace(/\t/g, "\\t");
    return str;
}

function toJsonString(value, indent, level) {
    indent = indent || "  ";
    level = level || 0;

    if (value === null) return "null";

    var t = typeof value;

    if (t === "string") {
        return "\"" + escapeJsonString(value) + "\"";
    }

    if (t === "number" || t === "boolean") {
        return String(value);
    }

    if (value instanceof Array) {
        if (value.length === 0) return "[]";

        var arrParts = [];
        for (var i = 0; i < value.length; i++) {
            arrParts.push(toJsonString(value[i], indent, level + 1));
        }

        var arrIndent = new Array(level + 2).join(indent);
        var arrCloseIndent = new Array(level + 1).join(indent);

        return "[\n" +
            arrIndent + arrParts.join(",\n" + arrIndent) +
            "\n" + arrCloseIndent + "]";
    }

    if (t === "object") {
        var objParts = [];
        for (var key in value) {
            if (value.hasOwnProperty(key)) {
                objParts.push(
                    "\"" + escapeJsonString(key) + "\": " +
                    toJsonString(value[key], indent, level + 1)
                );
            }
        }

        if (objParts.length === 0) return "{}";

        var objIndent = new Array(level + 2).join(indent);
        var objCloseIndent = new Array(level + 1).join(indent);

        return "{\n" +
            objIndent + objParts.join(",\n" + objIndent) +
            "\n" + objCloseIndent + "}";
    }

    return "null";
}

function startsWith(str, prefix) {
    return String(str).indexOf(prefix) === 0;
}

function hasRTLText(str) {
    if (str === null || str === undefined) return false;
    str = String(str);

    // Arabic / Persian / Hebrew Unicode ranges commonly used by RTL UI text.
    return /[\u0590-\u05FF\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/.test(str);
}

function getTextDirection(str) {
    return hasRTLText(str) ? "RTL" : "LTR";
}


function getRecommendedFontAssetForText(str) {
    return "";
}

function sanitizeName(name) {
    var safe = String(name);
    // Strip the ROT_ rotation-override token so widget names stay clean.
    // "BTN_Players ROT_-15"  ->  "BTN_Players"
    safe = safe.replace(/[ _]*ROT_-?[0-9]+(?:\.[0-9]+)?/gi, "");
    safe = safe.replace(/^\s+|\s+$/g, "");
    safe = safe.replace(/[^A-Za-z0-9_]+/g, "_");
    safe = safe.replace(/_+/g, "_");
    safe = safe.replace(/^_+|_+$/g, "");

    if (safe.length === 0) {
        safe = "Layer";
    }

    if (!safe.match(/^[A-Za-z_]/)) {
        safe = "L_" + safe;
    }

    return safe;
}


function getActualFontSizePt(layer)
{
    try
    {
        var ref = new ActionReference();
        ref.putIdentifier(charIDToTypeID("Lyr "), layer.id);

        var layerDesc = executeActionGet(ref);

        if (!layerDesc.hasKey(stringIDToTypeID("textKey")))
            return null;

        var textKey =
            layerDesc.getObjectValue(
                stringIDToTypeID("textKey")
            );

        var styleRanges =
            textKey.getList(
                stringIDToTypeID("textStyleRange")
            );

        if (styleRanges.count === 0)
            return null;

        var styleRange =
            styleRanges.getObjectValue(0);

        var textStyle =
            styleRange.getObjectValue(
                stringIDToTypeID("textStyle")
            );

        if (!textStyle.hasKey(stringIDToTypeID("size")))
            return null;

        return textStyle.getUnitDoubleValue(
            stringIDToTypeID("size")
        );
    }
    catch (e)
    {
        return null;
    }
}

function getCharacterPanelFontSize(layer)
{
    try
    {
        var ref = new ActionReference();
        ref.putIdentifier(charIDToTypeID("Lyr "), layer.id);

        var layerDesc = executeActionGet(ref);

        var textKey = layerDesc.getObjectValue(
            stringIDToTypeID("textKey")
        );

        var styleRanges = textKey.getList(
            stringIDToTypeID("textStyleRange")
        );

        if (styleRanges.count === 0)
            return null;

        var textStyleRange =
            styleRanges.getObjectValue(0);

        var textStyle =
            textStyleRange.getObjectValue(
                stringIDToTypeID("textStyle")
            );

        // Try the raw size first
        if (textStyle.hasKey(stringIDToTypeID("impliedFontSize")))
        {
            return textStyle.getUnitDoubleValue(
                stringIDToTypeID("impliedFontSize")
            );
        }

        if (textStyle.hasKey(stringIDToTypeID("size")))
        {
            return textStyle.getUnitDoubleValue(
                stringIDToTypeID("size")
            );
        }
    }
    catch(e)
    {
    }

    return null;
}

function makeUniqueName(baseName, usedNames) {
    var candidate = baseName;
    var index = 2;

    while (usedNames[candidate]) {
        candidate = baseName + "_" + index;
        index++;
    }

    usedNames[candidate] = true;
    return candidate;
}

function getLayerType(layer) {
    var name = layer.name;

    if (startsWith(name, "TXT_") || startsWith(name, "LABEL_")) {
        return "text";
    }

    if (startsWith(name, "TXIM_")) {
        return "textInputMultiLine";
    }

    if (startsWith(name, "TXI_")) {
        return "textInput";
    }

    if (startsWith(name, "ETBM_")) {
        return "editableTextBoxMultiLine";
    }

    if (startsWith(name, "ETB_")) {
        return "editableTextBox";
    }

    if (startsWith(name, "CMB_")) {
        return "comboBox";
    }

    if (startsWith(name, "SPN_")) {
        return "spinBox";
    }

    if (startsWith(name, "PGB_")) {
        return "progressBar";
    }

    // Empty or painted ArtLayer placeholder widgets. These export as real UMG container widgets
    // even when the Photoshop layer has transparent/empty bounds.
    if (startsWith(name, "SFZ_") || startsWith(name, "SAFE_")) {
        return "safeZone";
    }

    if (startsWith(name, "SCX_") || startsWith(name, "SCL_") || startsWith(name, "SBX_")) {
        return "scaleBox";
    }

    if (startsWith(name, "SCB_") || startsWith(name, "SCR_")) {
        return "scrollBox";
    }

    if (startsWith(name, "SZB_") || startsWith(name, "SIZE_")) {
        return "sizeBox";
    }

    if (startsWith(name, "STB_") || startsWith(name, "STK_")) {
        return "stackBox";
    }

    if (startsWith(name, "BDR_")) {
        return "border";
    }

    // Allow a GRD_/GDP_/GPN_ art layer to export as an empty GridPanel widget.
    if (startsWith(name, "GRD_") || startsWith(name, "GDP_") || startsWith(name, "GPN_")) {
        return "gridPanel";
    }

    // Allow a LSV_/LST_ art layer to export as an empty ListView widget.
    if (startsWith(name, "LSV_") || startsWith(name, "LST_")) {
        return "listView";
    }

    // Allow a TLV_/TIL_ art layer to export as an empty TileView widget.
    if (startsWith(name, "TLV_") || startsWith(name, "TIL_")) {
        return "tileView";
    }

    // Allow a TRV_/TVW_ art layer to export as an empty TreeView widget.
    if (startsWith(name, "TRV_") || startsWith(name, "TVW_")) {
        return "treeView";
    }

    // Allow a WSW_/WIS_ art layer to export as an empty WidgetSwitcher widget.
    if (startsWith(name, "WSW_") || startsWith(name, "WIS_")) {
        return "widgetSwitcher";
    }

    // Allow an OVL_/OLY_ art layer to export as an empty Overlay widget.
    // This is useful when the PSD needs an Overlay placeholder without child layers.
    if (startsWith(name, "OVL_") || startsWith(name, "OLY_")) {
        return "overlay";
    }

    if (startsWith(name, "OPT_")) {
        return "comboOption";
    }

    if (startsWith(name, "BTN_")) {
        return "button";
    }

    if (startsWith(name, "CHK_") || startsWith(name, "TGL_")) {
        return "checkbox";
    }

    if (startsWith(name, "SPS_")) {
        return "spacer";
    }

    // Visual parts used by compound widgets. These still export as images,
    // but they also receive semantic partRole metadata for the UE importer.
    if (startsWith(name, "IMG_") || startsWith(name, "BG_") || startsWith(name, "ICO_") || startsWith(name, "PNL_") ||
        startsWith(name, "BAR_") || startsWith(name, "FILL_") || startsWith(name, "THM_") || startsWith(name, "RTHM_") || startsWith(name, "BOX_") || startsWith(name, "CHKMARK_") ||
        startsWith(name, "ARW_") || startsWith(name, "OPTBG_")) {
        return "image";
    }

    return "unsupported";
}

function getGroupType(groupName) {
    if (startsWith(groupName, "BTN_")) {
        return "button";
    }

    if (startsWith(groupName, "SLD_")) {
        return "slider";
    }

    if (startsWith(groupName, "RSLD_") || startsWith(groupName, "RSL_") || startsWith(groupName, "RADSLD_")) {
        return "radialSlider";
    }

    if (startsWith(groupName, "CHK_") || startsWith(groupName, "TGL_")) {
        return "checkbox";
    }

    if (startsWith(groupName, "CHKG_")) {   // GROUPED CHECKBOX MODIFICATION
        return "checkboxGroup";
    }

    if (startsWith(groupName, "TXIM_")) {
        return "textInputMultiLine";
    }

    if (startsWith(groupName, "TXI_")) {
        return "textInput";
    }

    if (startsWith(groupName, "ETBM_")) {
        return "editableTextBoxMultiLine";
    }

    if (startsWith(groupName, "ETB_")) {
        return "editableTextBox";
    }

    if (startsWith(groupName, "CMB_")) {
        return "comboBox";
    }

    if (startsWith(groupName, "SPN_")) {
        return "spinBox";
    }

    if (startsWith(groupName, "PGB_")) {
        return "progressBar";
    }

    if (startsWith(groupName, "SFZ_") || startsWith(groupName, "SAFE_")) {
        return "safeZone";
    }

    if (startsWith(groupName, "SCX_") || startsWith(groupName, "SCL_") || startsWith(groupName, "SBX_")) {
        return "scaleBox";
    }

    if (startsWith(groupName, "SZB_") || startsWith(groupName, "SIZE_")) {
        return "sizeBox";
    }

    if (startsWith(groupName, "STB_") || startsWith(groupName, "STK_")) {
        return "stackBox";
    }

    if (startsWith(groupName, "BDR_")) {
        return "border";
    }

    if (startsWith(groupName, "WBX_")) {
        return "wrapBox";
    }

    if (startsWith(groupName, "UGP_")) {
        return "uniformGridPanel";
    }

    if (startsWith(groupName, "GRD_") || startsWith(groupName, "GDP_") || startsWith(groupName, "GPN_")) {
        return "gridPanel";
    }

    if (startsWith(groupName, "LSV_") || startsWith(groupName, "LST_")) {
        return "listView";
    }

    if (startsWith(groupName, "TLV_") || startsWith(groupName, "TIL_")) {
        return "tileView";
    }

    if (startsWith(groupName, "TRV_") || startsWith(groupName, "TVW_")) {
        return "treeView";
    }

    if (startsWith(groupName, "WSW_") || startsWith(groupName, "WIS_")) {
        return "widgetSwitcher";
    }

    if (startsWith(groupName, "SCB_") || startsWith(groupName, "SCR_")) {
        return "scrollBox";
    }

    if (startsWith(groupName, "OVL_") || startsWith(groupName, "OLY_")) {
        return "overlay";
    }

    if (startsWith(groupName, "OPT_")) {
        return "comboOption";
    }

    // CAN_* is an explicit screen/page canvas, for example CAN_MainMenu
    // or CAN_PlayerSelect. The UE importer can wrap this canvas with
    // SafeZone + ScaleBox while keeping the Photoshop child layout intact.
    if (startsWith(groupName, "CAN_")) {
        return "canvas";
    }

    // Auto-layout containers. The box itself uses Photoshop position/size,
    // while children should be arranged by the UE HorizontalBox/VerticalBox slot order.
    if (startsWith(groupName, "HBX_")) {
        return "horizontalBox";
    }

    if (startsWith(groupName, "VBX_")) {
        return "verticalBox";
    }

    if (startsWith(groupName, "SPS_")) {
        return "spacer";
    }

    if (startsWith(groupName, "PNL_") || startsWith(groupName, "BG_")) {
        return "panel";
    }

    if (startsWith(groupName, "GRP_")) {
        return "group";
    }

    // Unknown folders stay backward-compatible as regular layout groups.
    // They are no longer treated as screens. Use CAN_* for screen canvases.
    return "group";
}

function getGroupRole(groupName, parentGroupStack) {
    if (startsWith(groupName, "BTN_")) return "button";
    if (startsWith(groupName, "SLD_")) return "slider";
    if (startsWith(groupName, "RSLD_") || startsWith(groupName, "RSL_") || startsWith(groupName, "RADSLD_")) return "radialSlider";
    if (startsWith(groupName, "CHK_") || startsWith(groupName, "TGL_")) return "checkbox";
    if (startsWith(groupName, "CHKG_")) return "checkboxGroup";
    if (startsWith(groupName, "TXIM_")) return "textInputMultiLine";
    if (startsWith(groupName, "TXI_")) return "textInput";
    if (startsWith(groupName, "ETBM_")) return "editableTextBoxMultiLine";
    if (startsWith(groupName, "ETB_")) return "editableTextBox";
    if (startsWith(groupName, "CMB_")) return "comboBox";
    if (startsWith(groupName, "SPN_")) return "spinBox";
    if (startsWith(groupName, "PGB_")) return "progressBar";
    if (startsWith(groupName, "SFZ_") || startsWith(groupName, "SAFE_")) return "safeZone";
    if (startsWith(groupName, "SCX_") || startsWith(groupName, "SCL_") || startsWith(groupName, "SBX_")) return "scaleBox";
    if (startsWith(groupName, "SZB_") || startsWith(groupName, "SIZE_")) return "sizeBox";
    if (startsWith(groupName, "STB_") || startsWith(groupName, "STK_")) return "stackBox";
    if (startsWith(groupName, "BDR_")) return "border";
    if (startsWith(groupName, "WBX_")) return "wrapBox";
    if (startsWith(groupName, "UGP_")) return "uniformGridPanel";
    if (startsWith(groupName, "GRD_") || startsWith(groupName, "GDP_") || startsWith(groupName, "GPN_")) return "gridPanel";
    if (startsWith(groupName, "LSV_") || startsWith(groupName, "LST_")) return "listView";
    if (startsWith(groupName, "TLV_") || startsWith(groupName, "TIL_")) return "tileView";
    if (startsWith(groupName, "TRV_") || startsWith(groupName, "TVW_")) return "treeView";
    if (startsWith(groupName, "WSW_") || startsWith(groupName, "WIS_")) return "widgetSwitcher";
    if (startsWith(groupName, "SCB_") || startsWith(groupName, "SCR_")) return "scrollBox";
    if (startsWith(groupName, "OVL_") || startsWith(groupName, "OLY_")) return "overlay";
    if (startsWith(groupName, "OPT_")) return "comboOption";
    if (startsWith(groupName, "CAN_")) return "screen";
    if (startsWith(groupName, "HBX_")) return "horizontalBox";
    if (startsWith(groupName, "VBX_")) return "verticalBox";
    if (startsWith(groupName, "SPS_")) return "spacer";
    if (startsWith(groupName, "PNL_") || startsWith(groupName, "BG_")) return "panel";
    if (startsWith(groupName, "GRP_")) return "group";

    // Screen/menu containers are now explicit: CAN_MainMenu, CAN_Settings, etc.
    // Unprefixed Photoshop folders remain normal groups to avoid false screen creation.
    return "group";
}

function isToggleCheckboxName(rawName) {
    return startsWith(rawName, "TGL_");
}

function getWidgetTypeForGroup(groupType) {
    if (groupType === "button") return "Button";
    if (groupType === "slider") return "Slider";
    if (groupType === "radialSlider") return "RadialSlider";
    if (groupType === "checkbox") return "CheckBox";
    if (groupType === "checkboxGroup") return "CanvasPanel";   // GROUPED CHECKBOX MODIFICATION
    if (groupType === "textInput") return "EditableText";
    if (groupType === "textInputMultiLine") return "MultiLineEditableText";
    if (groupType === "editableTextBox") return "EditableTextBox";
    if (groupType === "editableTextBoxMultiLine") return "MultiLineEditableTextBox";
    if (groupType === "comboBox") return "ComboBoxString";
    if (groupType === "spinBox") return "SpinBox";
    if (groupType === "progressBar") return "ProgressBar";
    if (groupType === "safeZone") return "SafeZone";
    if (groupType === "scaleBox") return "ScaleBox";
    if (groupType === "sizeBox") return "SizeBox";
    if (groupType === "stackBox") return "StackBox";
    if (groupType === "border") return "Border";
    if (groupType === "wrapBox") return "WrapBox";
    if (groupType === "uniformGridPanel") return "UniformGridPanel";
    if (groupType === "gridPanel") return "GridPanel";
    if (groupType === "listView") return "ListView";
    if (groupType === "tileView") return "TileView";
    if (groupType === "treeView") return "TreeView";
    if (groupType === "widgetSwitcher") return "WidgetSwitcher";
    if (groupType === "scrollBox") return "ScrollBox";
    if (groupType === "overlay") return "Overlay";
    if (groupType === "comboOption") return "TextBlock";
    if (groupType === "horizontalBox") return "HorizontalBox";
    if (groupType === "verticalBox") return "VerticalBox";
    if (groupType === "spacer") return "Spacer";
    if (groupType === "canvas") return "CanvasPanel";
    if (groupType === "panel") return "CanvasPanel";
    return "CanvasPanel";
}

function getCompoundWidgetPartRole(rawName, parentRole) {
    var name = String(rawName || "");
    var role = "";

    if (startsWith(name, "FILL_")) {
        role = parentRole === "progressBar" ? "progressBarFill" : "fill";
    } else if (startsWith(name, "BAR_")) {
        if (parentRole === "scrollBox") {
            role = "scrollBoxBar";
        } else if (parentRole === "radialSlider") {
            // For RadialSlider, BAR_ only provides the final widget position and size.
            // It is not exported as a visual brush/background.
            role = "radialSliderSizeReference";
        } else if (parentRole === "progressBar") {
            role = "progressBarFill";
        } else if (name.toLowerCase().indexOf("fill") >= 0 || name.toLowerCase().indexOf("value") >= 0 || name.toLowerCase().indexOf("progress") >= 0) {
            role = "sliderFillBar";
        } else {
            role = "sliderBar";
        }
    } else if (startsWith(name, "RTHM_")) {
        role = "radialSliderThumb";
    } else if (startsWith(name, "THM_")) {
        role = parentRole === "scrollBox" ? "scrollBoxThumb" : "sliderThumb";
    } else if (startsWith(name, "BOX_")) {
        role = "checkboxBox";
    } else if (startsWith(name, "CHKMARK_")) {
        role = "checkboxCheckmark";
    } else if (startsWith(name, "TXT_") || startsWith(name, "LABEL_")) {
        if (parentRole === "checkbox") role = "checkboxLabel";
        else if (parentRole === "slider") role = "sliderLabel";
        else if (parentRole === "textInput" || parentRole === "textInputMultiLine" || parentRole === "editableTextBox" || parentRole === "editableTextBoxMultiLine") role = "placeholderText";
        else if (parentRole === "comboBox") role = "comboSelectedText";
        else if (parentRole === "spinBox") role = "spinBoxValueText";
        else if (parentRole === "progressBar") role = "progressBarLabel";
        else if (parentRole === "comboOption") role = "comboOptionText";
    } else if (startsWith(name, "BG_") && (parentRole === "editableTextBox" || parentRole === "editableTextBoxMultiLine" || parentRole === "comboBox" || parentRole === "spinBox" || parentRole === "progressBar" || parentRole === "border")) {
        if (parentRole === "comboBox") role = "comboBoxBackground";
        else if (parentRole === "spinBox") role = "spinBoxBackground";
        else if (parentRole === "progressBar") role = "progressBarBackground";
        else if (parentRole === "border") role = "borderBackground";
        else role = "inputBackground";
    } else if (startsWith(name, "ARW_") && parentRole === "comboBox") {
        role = "comboBoxArrow";
    } else if (startsWith(name, "OPT_") && parentRole === "comboBox") {
        role = "comboBoxOption";
    }

    return role;
}

function getDrawTypeForPartRole(partRole, rawName, layerType) {
    if (partRole === "sliderBar" || partRole === "sliderFillBar" || partRole === "radialSliderThumb" || partRole === "scrollBoxBar" || partRole === "scrollBoxThumb" || partRole === "progressBarBackground" || partRole === "progressBarFill" || partRole === "checkboxBox" || partRole === "checkboxCheckmark" || partRole === "inputBackground" || partRole === "comboBoxBackground" || partRole === "spinBoxBackground" || partRole === "borderBackground") {
        return "Box";
    }

    if (startsWith(rawName, "PNL_") || layerType === "button") {
        return "Box";
    }

    return "Image";
}

function getMarginForPartRole(partRole, rawName, layerType) {
    if (partRole === "sliderBar" || partRole === "sliderFillBar" || partRole === "radialSliderThumb" || partRole === "scrollBoxBar" || partRole === "scrollBoxThumb" || partRole === "progressBarBackground" || partRole === "progressBarFill" || partRole === "checkboxBox" || partRole === "checkboxCheckmark" || partRole === "inputBackground" || partRole === "comboBoxBackground" || partRole === "spinBoxBackground" || partRole === "borderBackground") {
        return [0.25, 0.25, 0.25, 0.25];
    }

    if (startsWith(rawName, "PNL_") || layerType === "button") {
        return [0.25, 0.25, 0.25, 0.25];
    }

    return [0.0, 0.0, 0.0, 0.0];
}

function isButtonStateGroupName(groupName) {
    return startsWith(String(groupName), "STATE_");
}

function stripHelperSuffixForDisplay(rawName)
{
// Keep helper suffixes such as "_image" in UE-facing names.
// Removing "_image" caused BTN_LoadGame_image to collide with BTN_LoadGame,
// which produced generated names like LoadGameButton_2.
return String(rawName || "");
}

function stripIdenticalSuffixForDisplay(rawName)
{
// Remove exporter-only texture-sharing suffixes from user-facing names
// and physical exported PNG names.
//
// Examples:
// IMG_Hover_A -> IMG_Hover
// IMG_Normal_IDN_B -> IMG_Normal
// IMG_Thumb_Level1_C -> IMG_Thumb_Level1
// IMG_Thumb_Level3_B -> IMG_Thumb_Level3
// BTN_LoadGame_STATE_hovered_A -> BTN_LoadGame_STATE_hovered
// BTN_LoadGame_STATE_normal_IDN_B -> BTN_LoadGame_STATE_normal
var name = String(rawName || "");
name = name.replace(/_IDN_[A-Z0-9]+$/i, "");
name = name.replace(/_([A-Z0-9]+)$/i, function(match, suffix) {
    // Never strip actual state-word tokens (they are real names, not sharing markers).
    if (/^(normal|hover|hovered|pressed|down|disabled)$/i.test(suffix)) {
        return match;
    }
    var basePart = name.substring(0, name.length - match.length);
    // Strip a single uppercase letter A-Z from any known image-type prefix layer.
    // This covers IMG_Thumb_Level1_C, BG_Panel_B, ICO_Star_D, THM_Bar_A, etc.
    if (/^[A-Z]$/.test(suffix) &&
        /^(IMG_|BG_|ICO_|THM_|BAR_|FILL_|RTHM_|BOX_|CHKMARK_)/i.test(basePart)) {
        return "";
    }
    // Keep existing logic for button-state suffix forms.
    if (/^(.*IMG_(Normal|Hover|Hovered|Pressed|Down|Disabled)|.*_STATE_(normal|hovered|pressed|disabled))$/i.test(basePart)) {
        return "";
    }
    return match;
});
return name;
}

function getIdenticalSuffix(rawName)
{
// Returns the explicit texture-sharing suffix exactly as written.
// Supports:
// IMG_Normal_IDN_B -> "_IDN_B"
// IMG_Hover_A      -> "_A"
//
// Does NOT treat normal/hover/pressed/disabled as sharing groups.
var name = String(rawName || "");

var idnMatch = name.match(/(_IDN_[A-Z0-9]+)$/i);
if (idnMatch) {
    return idnMatch[1];
}

var simpleMatch = name.match(/^(IMG_(Normal|Hover|Hovered|Pressed|Down|Disabled))(_[A-Z0-9]+)$/i);
if (!simpleMatch) {
    return "";
}

var suffix = simpleMatch[3].replace(/^_/, "");
if (/^(normal|hover|hovered|pressed|down|disabled)$/i.test(suffix)) {
    return "";
}

return simpleMatch[3];
}

function stripStateSharingSuffixForDetection(rawName)
{
var name = String(rawName || "");

// Old / explicit sharing metadata style.
name = name.replace(/_IDN_[A-Z0-9]+$/i, "");

// Simple suffix style used in large UI files:
// IMG_Normal_A, IMG_Hover_B, IMG_Pressed_Menu, etc.
// Only strip it for known button-state layer names so normal image names are not damaged.
name = name.replace(/^(IMG_(Normal|Hover|Hovered|Pressed|Down|Disabled))_[A-Z0-9]+$/i, "$1");

return name;
}

function normalizeButtonStateToken(rawName) {
    var state = sanitizeName(stripStateSharingSuffixForDetection(String(rawName || "")));

    // Supported direct state layers inside BTN_*:
    //   IMG_Normal, IMG_Hover, IMG_Pressed, IMG_Disabled
    // Also supports suffix markers:
    //   IMG_Normal_IDN_B, IMG_Hover_IDN_A, etc.
    // Also keep old STATE_* group support.
    state = state.replace(/^STATE_/, "");
    state = state.replace(/^IMG_/, "");
    state = state.replace(/^IMAGE_/, "");
    state = state.replace(/^BTN_/, "");
    state = state.toLowerCase();

    if (state === "normal" || state === "idle" || state === "default") return "normal";
    if (state === "hover" || state === "hovered" || state === "focus" || state === "focused") return "hovered";
    if (state === "press" || state === "pressed" || state === "click" || state === "clicked" || state === "down") return "pressed";
    if (state === "disabled" || state === "disable" || state === "inactive") return "disabled";

    return "";
}

function isButtonStateLayerName(layerName) {
    return normalizeButtonStateToken(layerName) !== "";
}

function getButtonStateName(groupName) {
    return normalizeButtonStateToken(groupName);
}

function makeButtonStateTextureName(buttonInfo, stateName, sourceLayerName) {
    var buttonSafe = buttonInfo && buttonInfo.safeName ? stripIdenticalSuffixForDisplay(buttonInfo.safeName) : "Button";
    var idnSuffix = getIdenticalSuffix(sourceLayerName);
    return sanitizeName(buttonSafe + "_STATE_" + stateName + idnSuffix);
}

function getSpacerSize(rawName) {
    var s = String(rawName || "");

    // Supported names:
    // SPS_60      -> [60, 60] legacy shorthand
    // SPS_60,0    -> [60, 0]
    // SPS_0,40    -> [0, 40]
    // SPS_16,16   -> [16, 16]
    var m = s.match(/^SPS[_ -]*(\d+(?:\.\d+)?)(?:\s*,\s*(\d+(?:\.\d+)?))?/i);
    if (m && m[1]) {
        var x = Number(m[1]);
        var y = (m[2] !== undefined && m[2] !== null && String(m[2]).length > 0) ? Number(m[2]) : x;
        return [x, y];
    }

    return [0, 0];
}

function getSpacerValue(rawName) {
    var size = getSpacerSize(rawName);
    return Math.max(size[0], size[1]);
}

function getUniformGridColumns(rawName) {
    var s = String(rawName || "");

    // Supported names:
    // UGP_Items      -> auto columns in importer/default 1
    // UGP_3          -> 3 columns
    // UGP_3x2        -> 3 columns, 2 rows hint
    // UGP_Columns4   -> 4 columns
    var m = s.match(/^UGP[_ -]*(\d+)(?:\s*[xX]\s*(\d+))?/i);
    if (m && m[1]) return Math.max(1, Number(m[1]));

    m = s.match(/Columns?[_ -]*(\d+)/i);
    if (m && m[1]) return Math.max(1, Number(m[1]));

    return 0;
}

function getUniformGridRows(rawName) {
    var s = String(rawName || "");
    var m = s.match(/^UGP[_ -]*(\d+)\s*[xX]\s*(\d+)/i);
    if (m && m[2]) return Math.max(1, Number(m[2]));
    m = s.match(/Rows?[_ -]*(\d+)/i);
    if (m && m[1]) return Math.max(1, Number(m[1]));
    return 0;
}

function getGridPanelColumns(rawName) {
    var s = String(rawName || "");

    // Supported names:
    // GRD_Items / GDP_Items / GPN_Items       -> importer default 1 column
    // GRD_3 / GDP_3 / GPN_3                  -> 3 columns
    // GRD_3x2 / GDP_3x2 / GPN_3x2            -> 3 columns, 2 rows hint
    // GRD_Columns4 / GDP_Columns4            -> 4 columns
    var m = s.match(/^(GRD|GDP|GPN)[_ -]*(\d+)(?:\s*[xX]\s*(\d+))?/i);
    if (m && m[2]) return Math.max(1, Number(m[2]));

    m = s.match(/Columns?[_ -]*(\d+)/i);
    if (m && m[1]) return Math.max(1, Number(m[1]));

    return 0;
}

function getGridPanelRows(rawName) {
    var s = String(rawName || "");
    var m = s.match(/^(GRD|GDP|GPN)[_ -]*(\d+)\s*[xX]\s*(\d+)/i);
    if (m && m[3]) return Math.max(1, Number(m[3]));
    m = s.match(/Rows?[_ -]*(\d+)/i);
    if (m && m[1]) return Math.max(1, Number(m[1]));
    return 0;
}

function isScrollBoxCustomSizeName(rawName) {
    var s = String(rawName || "");

    // SCB_S_ / SCR_S_ marks this ScrollBox as a custom-size viewport.
    // The Photoshop layer/group bounds are exported so the Unreal importer
    // can use them as the ScrollBox clipping/viewport size.
    return /^(SCB|SCR)[_ -]*S(_|-|$)/i.test(s);
}

function getScrollBoxOrientation(rawName) {
    var s = String(rawName || "");

    // Default ScrollBox orientation is vertical.
    // Supported names:
    // SCB_Items / SCR_Items                -> vertical
    // SCB_H_Items / SCR_H_Items            -> horizontal
    // SCB_Horizontal_Items                 -> horizontal
    // SCB_V_Items / SCR_V_Items            -> vertical
    // SCB_Vertical_Items                   -> vertical
    // SCB_S_Items / SCR_S_Items            -> vertical custom-size viewport
    // SCB_S_H_Items / SCR_S_H_Items        -> horizontal custom-size viewport
    // SCB_S_Horizontal_Items               -> horizontal custom-size viewport
    // SCB_S_V_Items / SCR_S_V_Items        -> vertical custom-size viewport
    // SCB_S_Vertical_Items                 -> vertical custom-size viewport
    if (/^(SCB|SCR)[_ -]*(S[_ -]*)?(H|Horizontal)(_|-|$)/i.test(s)) return "Horizontal";
    if (/^(SCB|SCR)[_ -]*(S[_ -]*)?(V|Vertical)(_|-|$)/i.test(s)) return "Vertical";
    if (/Horizontal/i.test(s)) return "Horizontal";
    return "Vertical";
}

function getStackBoxOrientation(rawName) {
    var s = String(rawName || "");

    // Default StackBox orientation is vertical.
    // Supported names:
    // STB_Items / STK_Items        -> vertical
    // STB_H_Items / STK_H_Items    -> horizontal
    // STB_Horizontal_Items         -> horizontal
    // STB_V_Items / STK_V_Items    -> vertical
    // STB_Vertical_Items           -> vertical
    if (/^(STB|STK)[_ -]*(H|Horizontal)(_|-|$)/i.test(s)) return "Horizontal";
    if (/^(STB|STK)[_ -]*(V|Vertical)(_|-|$)/i.test(s)) return "Vertical";
    if (/Horizontal/i.test(s)) return "Horizontal";
    return "Vertical";
}

function joinGroupPath(pathParts) {
    if (!pathParts || pathParts.length === 0) {
        return "";
    }
    return pathParts.join("/");
}

function getBounds(layer)
{
    try
    {
        var ref = new ActionReference();
        ref.putIdentifier(charIDToTypeID("Lyr "), layer.id);

        var desc = executeActionGet(ref);

        if (desc.hasKey(stringIDToTypeID("boundsNoEffects")))
        {
            var b = desc.getObjectValue(
                stringIDToTypeID("boundsNoEffects")
            );

            var left =
                b.getUnitDoubleValue(
                    stringIDToTypeID("left")
                );

            var top =
                b.getUnitDoubleValue(
                    stringIDToTypeID("top")
                );

            var right =
                b.getUnitDoubleValue(
                    stringIDToTypeID("right")
                );

            var bottom =
                b.getUnitDoubleValue(
                    stringIDToTypeID("bottom")
                );

            return {
                x: Math.round(left),
                y: Math.round(top),
                width: Math.round(right - left),
                height: Math.round(bottom - top)
            };
        }
    }
    catch(e)
    {
    }

    var bounds = layer.bounds;

    var x = px(bounds[0]);
    var y = px(bounds[1]);
    var right = px(bounds[2]);
    var bottom = px(bounds[3]);

    return {
        x: Math.round(x),
        y: Math.round(y),
        width: Math.round(right - x),
        height: Math.round(bottom - y)
    };
}

function colorToHex(solidColor) {
    try {
        var r = Math.round(solidColor.rgb.red);
        var g = Math.round(solidColor.rgb.green);
        var b = Math.round(solidColor.rgb.blue);

        function h(v) {
            var s = v.toString(16).toUpperCase();
            return s.length < 2 ? "0" + s : s;
        }

        return "#" + h(r) + h(g) + h(b);
    } catch (e) {
        return "#FFFFFF";
    }
}

// ── Solid-color layer detection (transparency-aware) ─────────────────────────
//
// Handles three transparency sources that can all coexist on one layer:
//
//   1. Layer Opacity  — the main opacity slider in the Layers panel (0-100 %).
//                       Affects the entire layer including effects.
//   2. Fill Opacity   — the "Fill" slider below the main opacity slider.
//                       Dims only the layer content; layer effects are unaffected.
//                       Readable via ActionDescriptor key "fillOpacity" (0-255).
//   3. Pixel alpha    — actual transparent pixels painted into a raster layer.
//                       For a solid-color layer this is either 0 % or 100 %;
//                       we detect it by checking sampled pixels on an alpha channel.
//
// The effective visual alpha we export is:
//   effectiveAlpha = layerOpacity(0-1) * fillOpacity(0-1)
//
// We bake this into the exported 64×64 PNG by setting the layer opacity to 100 %
// inside the temporary export document and instead pre-multiplying the color by
// the alpha — or, simpler and more correct for PNG: we keep opacity on the
// duplicated layer so Photoshop's own flatten produces the right RGBA pixels.
//
// The JSON gains:
//   isSolidColor   : true
//   solidColor     : "#RRGGBB"          ← pure RGB, no alpha baked in
//   solidColorRGBA : "#RRGGBBAA"        ← RGB + effective alpha as hex byte
//   layerOpacity   : 0.5               ← layer opacity (0-1)
//   fillOpacity    : 1.0               ← fill opacity (0-1)
//   effectiveAlpha : 0.5               ← layerOpacity * fillOpacity
//   exportedSize   : [64, 64]
//
// A solid-color layer with a 500×500 canvas wastes memory.  We export it at
// SOLID_COLOR_EXPORT_SIZE × SOLID_COLOR_EXPORT_SIZE; real bounds stay intact.
var SOLID_COLOR_EXPORT_SIZE = 64;

// ── Read fill opacity (0-255 internally, we return 0.0-1.0) ──────────────────
function getLayerFillOpacity(layer) {
    // fillOpacity lives in the layer descriptor, NOT on the DOM object.
    // It is stored as a byte (0-255).  Default is 255 (= 100 %).
    try {
        var ref = new ActionReference();
        ref.putIdentifier(charIDToTypeID("Lyr "), layer.id);
        var desc = executeActionGet(ref);
        if (desc.hasKey(stringIDToTypeID("fillOpacity"))) {
            var raw = desc.getInteger(stringIDToTypeID("fillOpacity")); // 0-255
            return Math.max(0, Math.min(1, raw / 255));
        }
    } catch (e) {}
    return 1.0; // default: fully opaque fill
}

// ── Read the RGB color of a SOLIDFILL adjustment layer ───────────────────────
function getSolidFillColor(layer) {
    try {
        var ref = new ActionReference();
        ref.putIdentifier(charIDToTypeID("Lyr "), layer.id);
        var desc = executeActionGet(ref);
        if (!desc.hasKey(stringIDToTypeID("adjustment"))) return null;
        var adjList = desc.getList(stringIDToTypeID("adjustment"));
        if (adjList.count === 0) return null;
        var adjDesc = adjList.getObjectValue(0);
        if (!adjDesc.hasKey(charIDToTypeID("Clr "))) return null;
        var colorDesc = adjDesc.getObjectValue(charIDToTypeID("Clr "));
        var r = Math.round(colorDesc.getDoubleValue(charIDToTypeID("Rd  ")));
        var g = Math.round(colorDesc.getDoubleValue(charIDToTypeID("Grn ")));
        var b = Math.round(colorDesc.getDoubleValue(charIDToTypeID("Bl  ")));
        function hx(v) { var s = v.toString(16).toUpperCase(); return s.length < 2 ? "0" + s : s; }
        return "#" + hx(r) + hx(g) + hx(b);
    } catch (e) {
        return null;
    }
}

// ── Detect vector masks / layer effects that must keep full-size PNGs ───────
//
// Rounded rectangles, pill bars, stroked panels, and other Photoshop shape layers
// may look like a flat color in the middle, but their corners/edges are carried
// by a vector mask or layer effect. Exporting those as 64x64 and stretching in
// Unreal can damage the corner radius / stroke. Keep those layers full-size.
function hasNonRectShapeMaskOrEffects(layer) {
    try {
        var ref = new ActionReference();
        ref.putIdentifier(charIDToTypeID("Lyr "), layer.id);
        var desc = executeActionGet(ref);

        // Photoshop shape layers commonly expose this boolean.
        if (desc.hasKey(stringIDToTypeID("hasVectorMask")) && desc.getBoolean(stringIDToTypeID("hasVectorMask"))) {
            return true;
        }

        // Extra fallbacks for different Photoshop versions / descriptors.
        if (desc.hasKey(stringIDToTypeID("vectorMask"))) return true;
        if (desc.hasKey(charIDToTypeID("vmsk"))) return true;
        if (desc.hasKey(charIDToTypeID("UsrM"))) return true;

        // Stroke / inner shadow / outer glow / etc. are part of the visual edge.
        // Do not shrink those to 64x64.
        if (desc.hasKey(stringIDToTypeID("layerEffects"))) {
            var fx = desc.getObjectValue(stringIDToTypeID("layerEffects"));
            if (fx.hasKey(stringIDToTypeID("masterFXSwitch")) && !fx.getBoolean(stringIDToTypeID("masterFXSwitch"))) {
                return false;
            }
            return true;
        }
    } catch (e) {}

    return false;
}

// ── Detect whether a layer is visually a uniform solid color ─────────────────
//
// A layer qualifies as "solid color" ONLY when ALL of these are true:
//   1. Every sampled pixel has the exact same RGB value (no gradients, no art).
//   2. Every sampled pixel has the same alpha value (no soft edges, no holes).
//      We detect per-pixel alpha by temporarily hiding all OTHER layers and
//      sampling the composite — if the composite color varies while the layer
//      color is constant, pixel alpha is varying.
//
// Why 5 corner+center samples were not enough:
//   • A horizontally-fading bar (like the one in the screenshot) has the same
//     center color at all Y positions but different alpha near the edges → the
//     5-point check passed incorrectly.
//   • A circle with a transparent hole has different alpha in the middle vs the
//     ring → also passed incorrectly.
//
// New strategy: sample a 4×4 grid (16 points spread evenly across the layer
// bounding box, inset slightly from the edges) plus the center.  Each sample
// checks BOTH rgb AND alpha.  Any mismatch → not solid.
//
// We read alpha indirectly: Photoshop's colorSamplers return the composite
// colour, which includes underlying layers.  Instead we use a scriptable
// approach: duplicate the layer alone into a temporary document and sample
// the pixel values there, where alpha-zero areas will read as the transparent
// background color.  But that requires a document round-trip which is slow.
//
// Faster alternative: use the histogram ActionDescriptor on the layer's own
// pixel data to check whether all pixels share one alpha value.
// The "std" (standard deviation) of the alpha channel histogram being 0
// means every pixel has the same alpha → uniform alpha.
//
// For SOLIDFILL layers Photoshop guarantees uniform RGB+alpha, so we skip
// sampling entirely and return true immediately.
function isLayerSolidColor(layer) {
    // Do not optimize Photoshop shape/vector/effect layers. This protects rounded
    // corners, pill backgrounds, strokes, and other non-rectangular edge data.
    if (hasNonRectShapeMaskOrEffects(layer)) {
        return false;
    }

    // Only plain raster, smart-object, and unmasked solid-fill layers can be
    // safely reduced to a 64x64 solid texture.
    if (layer.kind !== LayerKind.NORMAL && layer.kind !== LayerKind.SMARTOBJECT && layer.kind !== LayerKind.SOLIDFILL) {
        return false;
    }

    try {
        var bounds = getBounds(layer);
        if (bounds.width <= 0 || bounds.height <= 0) return false;

        // ── Strategy: duplicate layer into a tiny isolated probe doc ──────────
        //
        // doc.colorSamplers reads the COMPOSITE (all visible layers merged).
        // Hiding sibling top-level layers is not enough: siblings WITHIN the
        // same group stay visible and bleed into the sample.  For a large
        // background layer (e.g. the full-canvas blue rect) all other UI layers
        // sit on top inside the same group — the sampler reads those colors
        // instead of blue, producing a false "not solid" result.
        //
        // The previous Step 1 alpha-statistics check is also removed: Photoshop
        // returns a non-zero stdDev for fully-opaque raster layers that have no
        // alpha channel at all, causing valid solid layers to be wrongly rejected.
        //
        // Fix: duplicate the single layer into a fresh 32x32 transparent doc,
        // scale it to fill that canvas, then sample 5 points there.  Only that
        // one layer exists in the probe doc, so the composite IS the layer.

        var PROBE_SIZE = 32;
        var isSolid = false;
        var probeDoc = null;

        try {
            probeDoc = app.documents.add(
                PROBE_SIZE, PROBE_SIZE, doc.resolution,
                "solidcolor_probe_tmp",
                NewDocumentMode.RGB,
                DocumentFill.TRANSPARENT
            );

            app.activeDocument = doc;
            var dupLayer = layer.duplicate(probeDoc, ElementPlacement.PLACEATBEGINNING);

            app.activeDocument = probeDoc;

            // Scale + position the duplicated layer to fill the 32x32 canvas.
            try {
                var db = dupLayer.bounds;
                var dw = Math.round(Number(db[2].as("px")) - Number(db[0].as("px")));
                var dh = Math.round(Number(db[3].as("px")) - Number(db[1].as("px")));
                if (dw > 0 && dh > 0) {
                    var offX2 = -Number(db[0].as("px"));
                    var offY2 = -Number(db[1].as("px"));
                    if (Math.abs(offX2) > 0.5 || Math.abs(offY2) > 0.5) {
                        dupLayer.translate(offX2, offY2);
                    }
                    dupLayer.resize((PROBE_SIZE / dw) * 100, (PROBE_SIZE / dh) * 100, AnchorPosition.TOPLEFT);
                }
            } catch (scaleErr) {}

            // ── Alpha check: sample the 4 true corners of the probe canvas ─────
            // A rounded-rectangle or circle layer has uniform RGB inside but
            // transparent corners.  The scaled layer fills the 32x32 canvas, so
            // pixel [0,0] etc. map exactly to the layer corners.
            // We read alpha indirectly: in a document with DocumentFill.TRANSPARENT,
            // a fully-transparent pixel composites as [0, 0, 0] (black) regardless
            // of the layer colour.  An opaque pixel of any non-black colour will NOT
            // read as [0,0,0].  So:
            //   • Sample the interior centre first to get the reference RGB.
            //   • Sample the 4 true corners.  If ANY corner reads [0,0,0] (or a
            //     noticeably different value from the centre) → rounded/non-rect → not solid.
            //
            // Edge case: a layer that IS solid black (#000000 fully opaque) would
            // have corners that also read [0,0,0], which would be a false negative.
            // We handle that: if the interior reference IS black, we skip the
            // corner-alpha check (a solid black rect with hard corners is fine).

            // Step A: get interior reference colour (centre of the probe canvas).
            var cx = Math.floor(PROBE_SIZE / 2);
            var cy = Math.floor(PROBE_SIZE / 2);
            var centreSampler = probeDoc.colorSamplers.add([cx, cy]);
            var cRgb = centreSampler.color.rgb;
            var cR = Math.round(cRgb.red);
            var cG = Math.round(cRgb.green);
            var cB = Math.round(cRgb.blue);
            centreSampler.remove();
            var refRGB = cR + "," + cG + "," + cB;

            var centreIsBlack = (cR < 4 && cG < 4 && cB < 4);

            // If the layer itself is black/dark, transparent corners also sample as black
            // in a transparent probe document. Add a white background BEHIND the duplicated
            // layer, then resample the centre. Full black rectangles still read black at
            // the corners, but black rounded rectangles reveal the white background.
            if (centreIsBlack) {
                try {
                    var bgLayer = probeDoc.artLayers.add();
                    bgLayer.name = "solidcolor_probe_white_bg";

                    var white = new SolidColor();
                    white.rgb.red = 255;
                    white.rgb.green = 255;
                    white.rgb.blue = 255;

                    probeDoc.activeLayer = bgLayer;
                    probeDoc.selection.selectAll();
                    probeDoc.selection.fill(white, ColorBlendMode.NORMAL, 100, false);
                    probeDoc.selection.deselect();

                    try { bgLayer.move(dupLayer, ElementPlacement.PLACEAFTER); } catch (moveBgErr) {}
                    probeDoc.activeLayer = dupLayer;

                    var centreSampler2 = probeDoc.colorSamplers.add([cx, cy]);
                    var cRgb2 = centreSampler2.color.rgb;
                    cR = Math.round(cRgb2.red);
                    cG = Math.round(cRgb2.green);
                    cB = Math.round(cRgb2.blue);
                    centreSampler2.remove();
                    refRGB = cR + "," + cG + "," + cB;
                } catch (blackProbeErr) {}
            }

            // Step B: sample 4 true corners to detect rounded/transparent corners.
            var cornerOk = true;
            var corners = [[0, 0], [PROBE_SIZE - 1, 0], [0, PROBE_SIZE - 1], [PROBE_SIZE - 1, PROBE_SIZE - 1]];
            for (var ci = 0; ci < corners.length; ci++) {
                var cs = probeDoc.colorSamplers.add([corners[ci][0], corners[ci][1]]);
                var csRgb = cs.color.rgb;
                var csR = Math.round(csRgb.red);
                var csG = Math.round(csRgb.green);
                var csB = Math.round(csRgb.blue);
                cs.remove();

                var cornerDiff = Math.abs(csR - cR) + Math.abs(csG - cG) + Math.abs(csB - cB);
                if (cornerDiff > 6) {
                    cornerOk = false;
                    break;
                }
            }

            if (!cornerOk) {
                isSolid = false;
            } else {
                // Step C: check uniform RGB across a 3x3 interior grid (inset 3 px).
                var interiorPts = [
                    [3, 3], [cx, 3], [PROBE_SIZE - 4, 3],
                    [3, cy], [cx, cy], [PROBE_SIZE - 4, cy],
                    [3, PROBE_SIZE - 4], [cx, PROBE_SIZE - 4], [PROBE_SIZE - 4, PROBE_SIZE - 4]
                ];
                var allMatch = true;
                for (var pi = 0; pi < interiorPts.length; pi++) {
                    var sp = interiorPts[pi];
                    var sampler = probeDoc.colorSamplers.add([sp[0], sp[1]]);
                    var rgb2 = sampler.color.rgb;
                    var rgbKey = Math.round(rgb2.red) + "," + Math.round(rgb2.green) + "," + Math.round(rgb2.blue);
                    sampler.remove();
                    if (rgbKey !== refRGB) {
                        allMatch = false;
                        break;
                    }
                }
                isSolid = allMatch;
            }

        } catch (probeErr) {
            isSolid = false;
        } finally {
            if (probeDoc) {
                try { probeDoc.close(SaveOptions.DONOTSAVECHANGES); } catch (closeErr) {}
                try { app.activeDocument = doc; } catch (reactivateErr) {}
            }
        }

        return isSolid;

    } catch (e) {
        return false;
    }
}

// ── Read the full transparency info for a solid-color layer ──────────────────
// Returns an object:
//   {
//     rgb           : "#RRGGBB",
//     rgba          : "#RRGGBBAA",
//     layerOpacity  : 0.0-1.0,   // from layer.opacity (0-100 in PS DOM → /100)
//     fillOpacity   : 0.0-1.0,   // from fillOpacity descriptor (0-255 → /255)
//     effectiveAlpha: 0.0-1.0    // layerOpacity * fillOpacity
//   }
function getSolidColorInfo(layer) {
    function hx(v) {
        var s = Math.round(Math.max(0, Math.min(255, v))).toString(16).toUpperCase();
        return s.length < 2 ? "0" + s : s;
    }

    // ── RGB ───────────────────────────────────────────────────────────────────
    var r = 255, g = 255, b = 255;

    try {
        if (layer.kind === LayerKind.SOLIDFILL) {
            var fillHex = getSolidFillColor(layer);
            if (fillHex && fillHex.length >= 7) {
                r = parseInt(fillHex.slice(1, 3), 16);
                g = parseInt(fillHex.slice(3, 5), 16);
                b = parseInt(fillHex.slice(5, 7), 16);
            }
        } else {
            // Sample center pixel for raster layers.
            var bounds = getBounds(layer);
            var cx = bounds.x + Math.floor(bounds.width  / 2);
            var cy = bounds.y + Math.floor(bounds.height / 2);
            var sampler = doc.colorSamplers.add([cx, cy]);
            var rgb = sampler.color.rgb;
            r = Math.round(rgb.red);
            g = Math.round(rgb.green);
            b = Math.round(rgb.blue);
            sampler.remove();
        }
    } catch (e) {}

    // ── Opacity sources ───────────────────────────────────────────────────────
    // 1. Layer opacity — DOM property, 0-100.
    var layerOpacity = 1.0;
    try { layerOpacity = Math.max(0, Math.min(100, Number(layer.opacity))) / 100; } catch (e) {}

    // 2. Fill opacity — ActionDescriptor, 0-255.
    var fillOpacity = getLayerFillOpacity(layer);

    // 3. Effective alpha combines both multiplicatively.
    var effectiveAlpha = layerOpacity * fillOpacity;
    var alphaInt = Math.round(effectiveAlpha * 255);

    return {
        rgb:            "#" + hx(r) + hx(g) + hx(b),
        rgba:           "#" + hx(r) + hx(g) + hx(b) + hx(alphaInt),
        layerOpacity:   Math.round(layerOpacity   * 1000) / 1000,
        fillOpacity:    Math.round(fillOpacity     * 1000) / 1000,
        effectiveAlpha: Math.round(effectiveAlpha  * 1000) / 1000
    };
}

// ── Export a solid-color layer as a 64×64 PNG with correct alpha ──────────────
// Strategy:
//   • Create a 64×64 RGBA document.
//   • Duplicate the solid-color layer into it.
//   • Keep the duplicated layer's opacity exactly as it was (Photoshop will
//     honour both layer opacity AND fill opacity when flattening/saving).
//   • Scale the content to fill the canvas.
//   • Save as PNG-32 (transparency = true) so alpha is embedded in the file.
//
// This means the exported PNG already carries the designer's intended alpha —
// the Unreal importer does NOT need to apply any additional tinting; it just
// stretches the texture to the widget bounds.
function exportSolidColorLayerPng(sourceDoc, indexPath, outFileFsPath) {
    var targetLayer = getLayerByIndexPath(sourceDoc, indexPath);
    if (!targetLayer) {
        warnings.push("exportSolidColorLayerPng: layer not found at index path " + indexPath + " — skipped.");
        return; // skip, do not throw
    }

    var size = SOLID_COLOR_EXPORT_SIZE;

    var exportDoc = app.documents.add(size, size, sourceDoc.resolution,
        "solidcolor_tmp", NewDocumentMode.RGB, DocumentFill.TRANSPARENT);

    try {
        app.activeDocument = sourceDoc;
        var dupLayer = targetLayer.duplicate(exportDoc, ElementPlacement.PLACEATBEGINNING);

        app.activeDocument = exportDoc;

        // Preserve the layer's opacity and fill opacity exactly — do NOT reset
        // them to 100 %.  Photoshop bakes both into the PNG pixels when saving
        // with transparency=true.

        // Move + scale to fill the 64×64 canvas.
        var dupBounds = dupLayer.bounds;
        var origW = Math.round(Number(dupBounds[2].as("px")) - Number(dupBounds[0].as("px")));
        var origH = Math.round(Number(dupBounds[3].as("px")) - Number(dupBounds[1].as("px")));

        if (origW > 0 && origH > 0) {
            var offX = -Number(dupBounds[0].as("px"));
            var offY = -Number(dupBounds[1].as("px"));
            if (Math.abs(offX) > 0.5 || Math.abs(offY) > 0.5) {
                dupLayer.translate(offX, offY);
            }
            var scaleX = (size / origW) * 100;
            var scaleY = (size / origH) * 100;
            dupLayer.resize(scaleX, scaleY, AnchorPosition.TOPLEFT);
        }

        var outFile = new File(outFileFsPath);
        var opts    = new ExportOptionsSaveForWeb();
        opts.format         = SaveDocumentType.PNG;
        opts.PNG8           = false;
        opts.transparency   = true;   // ← essential: preserves alpha channel
        opts.interlaced     = false;
        opts.includeProfile = false;
        opts.optimized      = true;
        opts.quality        = 100;

        exportDoc.exportDocument(outFile, ExportType.SAVEFORWEB, opts);
    } finally {
        exportDoc.close(SaveOptions.DONOTSAVECHANGES);
        try { app.activeDocument = sourceDoc; } catch (e) {}
    }
}

function normalizeJustification(value) {
    var s = String(value).toLowerCase();
    if (s.indexOf("center") >= 0) return "Center";
    if (s.indexOf("right") >= 0) return "Right";
    return "Left";
}

function getAnchorPreset(bounds, parentBounds) {
    if (!bounds) {
        return "Center";
    }

    if (!parentBounds || !parentBounds.width || !parentBounds.height) {
        parentBounds = {
            x: 0,
            y: 0,
            width: app.activeDocument.width.as("px"),
            height: app.activeDocument.height.as("px")
        };
    }

    var parentLeft = parentBounds.x;
    var parentTop = parentBounds.y;
    var parentRight = parentBounds.x + parentBounds.width;
    var parentBottom = parentBounds.y + parentBounds.height;
    var parentCenterX = parentBounds.x + parentBounds.width * 0.5;
    var parentCenterY = parentBounds.y + parentBounds.height * 0.5;

    var left = bounds.x;
    var top = bounds.y;
    var right = bounds.x + bounds.width;
    var bottom = bounds.y + bounds.height;
    var centerX = bounds.x + bounds.width * 0.5;
    var centerY = bounds.y + bounds.height * 0.5;

    var distLeft = Math.abs(left - parentLeft);
    var distRight = Math.abs(parentRight - right);
    var distTop = Math.abs(top - parentTop);
    var distBottom = Math.abs(parentBottom - bottom);
    var distCenterX = Math.abs(centerX - parentCenterX);
    var distCenterY = Math.abs(centerY - parentCenterY);

    var centerToleranceX = Math.max(40, parentBounds.width * 0.15);
    var centerToleranceY = Math.max(40, parentBounds.height * 0.15);

    var horizontal = "Center";
    var vertical = "Center";

    // Horizontal anchor:
    // - if the element center is close to the parent center, use Center
    // - otherwise attach to the nearest horizontal side using the element edges
    if (distCenterX <= centerToleranceX) {
        horizontal = "Center";
    } else if (distLeft <= distRight) {
        horizontal = "Left";
    } else {
        horizontal = "Right";
    }

    // Vertical anchor:
    // - if the element center is close to the parent center, use Center
    // - otherwise attach to the nearest vertical side using the element edges
    if (distCenterY <= centerToleranceY) {
        vertical = "Center";
    } else if (distTop <= distBottom) {
        vertical = "Top";
    } else {
        vertical = "Bottom";
    }

    if (horizontal === "Center" && vertical === "Center") {
        return "Center";
    }

    if (vertical === "Center") {
        return "Center" + horizontal;
    }

    if (horizontal === "Center") {
        return vertical + "Center";
    }

    return vertical + horizontal;
}

function getPivotForLayer(layerType, rawName) {
    if (startsWith(rawName, "BG_")) {
        return [0.0, 0.0];
    }

    if (layerType === "text" || layerType === "button" || layerType === "textInput" || layerType === "textInputMultiLine" || layerType === "editableTextBox" || layerType === "editableTextBoxMultiLine" || layerType === "comboBox" || layerType === "spinBox" || layerType === "comboOption" || layerType === "overlay") {
        return [0.5, 0.5];
    }

    return [0.0, 0.0];
}

function getTagsForLayer(layerType, rawName, groupPathParts, groupRole) {
    var tags = [];
    if (layerType === "button") tags.push("Button");
    if (layerType === "text") tags.push("Text");
    if (groupRole === "screen") tags.push("Screen");
    if (groupRole === "slider") tags.push("Slider");
    if (groupRole === "radialSlider") tags.push("RadialSlider");
    if (groupRole === "checkbox") tags.push("CheckBox");
    if (groupRole === "checkboxGroup") tags.push("CheckboxGroup"); // GROUPED CHECKBOX MODIFICATION
    if ((groupRole === "checkbox" || layerType === "checkbox") && startsWith(rawName, "TGL_")) tags.push("ToggleButton");
    if (groupRole === "textInput" || groupRole === "textInputMultiLine") tags.push("TextInput");
    if (groupRole === "editableTextBox" || groupRole === "editableTextBoxMultiLine") tags.push("EditableTextBox");
    if (groupRole === "comboBox") tags.push("ComboBox");
    if (groupRole === "spinBox") tags.push("SpinBox");
    if (groupRole === "comboOption") tags.push("ComboOption");
    if (groupRole === "horizontalBox") tags.push("HorizontalBox");
    if (groupRole === "verticalBox") tags.push("VerticalBox");
    if (groupRole === "gridPanel" || layerType === "gridPanel") tags.push("GridPanel");
    if (groupRole === "listView" || layerType === "listView") tags.push("ListView");
    if (groupRole === "tileView" || layerType === "tileView") tags.push("TileView");
    if (groupRole === "treeView" || layerType === "treeView") tags.push("TreeView");
    if (groupRole === "widgetSwitcher" || layerType === "widgetSwitcher") tags.push("WidgetSwitcher");
    if (groupRole === "overlay" || layerType === "overlay") tags.push("Overlay");
    if (startsWith(rawName, "BG_")) tags.push("Background");
    if (startsWith(rawName, "ICO_")) tags.push("Icon");
    if (startsWith(rawName, "PNL_")) tags.push("Panel");
    if (startsWith(rawName, "BAR_")) tags.push("Bar");
    if (startsWith(rawName, "RTHM_")) tags.push("RadialThumb");
    if (startsWith(rawName, "THM_")) tags.push("Thumb");
    if (startsWith(rawName, "BOX_")) tags.push("Box");
    if (startsWith(rawName, "CHKMARK_")) tags.push("Checkmark");
    if (startsWith(rawName, "TXI_") || startsWith(rawName, "TXIM_")) tags.push("TextInput");
    if (startsWith(rawName, "ETB_") || startsWith(rawName, "ETBM_")) tags.push("EditableTextBox");
    if (startsWith(rawName, "CMB_")) tags.push("ComboBox");
    if (startsWith(rawName, "SPN_")) tags.push("SpinBox");
    if (startsWith(rawName, "OPT_")) tags.push("ComboOption");
    if (startsWith(rawName, "ARW_")) tags.push("Arrow");
    if (groupPathParts && groupPathParts.length > 0) tags.push(groupPathParts[groupPathParts.length - 1]);
    return tags;
}

function getInteractionName(rawName) {
    var safe = sanitizeName(rawName);
    safe = safe.replace(/^BTN_/, "");
    if (safe.length === 0) safe = "Clicked";
    return safe;
}

function getInteractionKey(rawName) {
    var safe = sanitizeName(rawName);
    safe = safe.replace(/^BTN_/, "");
    safe = safe.replace(/^SLD_/, "");
    safe = safe.replace(/^RSLD_/, "");
    safe = safe.replace(/^RSL_/, "");
    safe = safe.replace(/^RADSLD_/, "");
    safe = safe.replace(/^RTHM_/, "");
    safe = safe.replace(/^CHK_/, "");
    safe = safe.replace(/^TGL_/, "");
    safe = safe.replace(/^TXIM_/, "");
    safe = safe.replace(/^TXI_/, "");
    safe = safe.replace(/^ETBM_/, "");
    safe = safe.replace(/^ETB_/, "");
    safe = safe.replace(/^CMB_/, "");
    safe = safe.replace(/^SPN_/, "");
    safe = safe.replace(/^OPT_/, "");
    safe = safe.replace(/^PNL_/, "");
    safe = safe.replace(/^GRP_/, "");
    safe = safe.replace(/^HBX_/, "");
    safe = safe.replace(/^VBX_/, "");
    safe = safe.replace(/^WBX_/, "");
    safe = safe.replace(/^SCB_S_Horizontal_/, "");
    safe = safe.replace(/^SCB_S_Vertical_/, "");
    safe = safe.replace(/^SCB_S_H_/, "");
    safe = safe.replace(/^SCB_S_V_/, "");
    safe = safe.replace(/^SCB_S_/, "");
    safe = safe.replace(/^SCR_S_Horizontal_/, "");
    safe = safe.replace(/^SCR_S_Vertical_/, "");
    safe = safe.replace(/^SCR_S_H_/, "");
    safe = safe.replace(/^SCR_S_V_/, "");
    safe = safe.replace(/^SCR_S_/, "");
    safe = safe.replace(/^SCB_/, "");
    safe = safe.replace(/^SCR_/, "");
    safe = safe.replace(/^OVL_/, "");
    safe = safe.replace(/^OLY_/, "");
    safe = safe.replace(/^CAN_/, "");
    safe = safe.replace(/^MENU_/, "");
    safe = safe.replace(/^POPUP_/, "");
    safe = safe.replace(/^HUD_/, "");
    return safe.toLowerCase();
}



function findGroupById(groupId) {
    if (!groupId) return null;
    for (var i = 0; i < exportedGroups.length; i++) {
        if (exportedGroups[i] && exportedGroups[i].id === groupId) {
            return exportedGroups[i];
        }
    }
    return null;
}

function isCloseButtonName(rawName) {
    return getInteractionKey(rawName) === "close";
}

function isExitButtonName(rawName) {
    return getInteractionKey(rawName) === "exit";
}

// ========== CORRECTED findGroupTargetForButton (excludes self, prefers WidgetSwitcher child) ==========
function findGroupTargetForButton(buttonRawName, excludeGroupId) {
    var buttonKey = getInteractionKey(buttonRawName);
    if (!buttonKey) return null;

    // First pass: look for a group that is a direct child of a WidgetSwitcher
    for (var i = 0; i < exportedGroups.length; i++) {
        var groupEntry = exportedGroups[i];
        if (!groupEntry) continue;
        if (excludeGroupId && groupEntry.id === excludeGroupId) continue;

        var groupKeyFromSafe = getInteractionKey(groupEntry.safeName);
        var groupKeyFromName = getInteractionKey(groupEntry.name);
        if (buttonKey !== groupKeyFromSafe && buttonKey !== groupKeyFromName) continue;

        // Check if parent is a WidgetSwitcher
        var parent = findGroupById(groupEntry.parentId);
        if (parent && parent.type === "widgetSwitcher") {
            return groupEntry;   // perfect match – tab page
        }
    }

    // Second pass: any other matching group (but still exclude the button itself)
    for (var i = 0; i < exportedGroups.length; i++) {
        var groupEntry = exportedGroups[i];
        if (!groupEntry) continue;
        if (excludeGroupId && groupEntry.id === excludeGroupId) continue;

        var groupKeyFromSafe = getInteractionKey(groupEntry.safeName);
        var groupKeyFromName = getInteractionKey(groupEntry.name);
        if (buttonKey === groupKeyFromSafe || buttonKey === groupKeyFromName) {
            return groupEntry;
        }
    }

    return null;
}
// ========== END corrected function ==========

// Returns the 0-based child index of groupEntry inside its direct WSW_/WIS_ parent,
// or -1 if the parent is not a WidgetSwitcher (or parent not found).
function getChildIndexInSwitcher(groupEntry) {
    if (!groupEntry || !groupEntry.parentId) return -1;

    var parent = findGroupById(groupEntry.parentId);
    if (!parent) return -1;

    var parentType = parent.type || "";
    if (parentType !== "widgetSwitcher") return -1;

    // Walk parent.children in insertion order — this matches Photoshop layer traversal
    // order and therefore the UMG WidgetSwitcher slot order produced by the importer.
    var children = parent.children || [];
    for (var i = 0; i < children.length; i++) {
        if (children[i].id === groupEntry.id) {
            return i;
        }
    }

    return -1;
}

function applyButtonVisibilityTargets() {
    for (var i = 0; i < exportedGroups.length; i++) {
        var groupButton = exportedGroups[i];
        if (groupButton && groupButton.type === "button") {
            applyVisibilityTargetToButtonEntry(groupButton);
        }
    }

    for (var j = 0; j < exportedLayers.length; j++) {
        var layerButton = exportedLayers[j];
        if (layerButton && layerButton.type === "button") {
            applyVisibilityTargetToButtonEntry(layerButton);
        }
    }
}

function applyVisibilityTargetToButtonEntry(buttonEntry) {
    if (!buttonEntry.interaction) {
        buttonEntry.interaction = {
            event: getInteractionName(buttonEntry.name)
        };
    }

    // Reserved semantic buttons:
    // BTN_Close closes its own parent container.
    // BTN_Exit is exported as an exit placeholder for the UE importer/game code.
    if (isCloseButtonName(buttonEntry.name)) {
        var parentTarget = findGroupById(buttonEntry.parentId);
        buttonEntry.interaction.action = parentTarget ? "closeParent" : "default";
        if (parentTarget) {
            buttonEntry.interaction.target = parentTarget.safeName;
            buttonEntry.interaction.targetName = parentTarget.name;
            buttonEntry.interaction.targetId = parentTarget.id;
            buttonEntry.interaction.targetType = parentTarget.type;
            buttonEntry.interaction.targetRole = parentTarget.groupRole || "";
        }
        return;
    }

    if (isExitButtonName(buttonEntry.name)) {
        buttonEntry.interaction.action = "exit";
        buttonEntry.interaction.target = "";
        buttonEntry.interaction.targetName = "";
        buttonEntry.interaction.targetId = "";
        buttonEntry.interaction.targetType = "";
        buttonEntry.interaction.targetRole = "";
        return;
    }

    var targetGroup = findGroupTargetForButton(buttonEntry.name, buttonEntry.id);

    if (targetGroup) {
        // Check whether the target is a direct child of a WSW_/WIS_ WidgetSwitcher.
        // If so, emit a "switchTab" action so the importer wires SetActiveWidgetIndex
        // instead of a visibility toggle.
        var switcherIndex = getChildIndexInSwitcher(targetGroup);
        if (switcherIndex >= 0) {
            var switcherParent = findGroupById(targetGroup.parentId);
            buttonEntry.interaction.action = "switchTab";
            buttonEntry.interaction.target = targetGroup.safeName;
            buttonEntry.interaction.targetName = targetGroup.name;
            buttonEntry.interaction.targetId = targetGroup.id;
            buttonEntry.interaction.targetType = targetGroup.type;
            buttonEntry.interaction.targetRole = targetGroup.groupRole || "";
            buttonEntry.interaction.switcherTarget = switcherParent ? switcherParent.safeName : "";
            buttonEntry.interaction.switcherTargetId = switcherParent ? switcherParent.id : "";
            buttonEntry.interaction.switcherIndex = switcherIndex;
        } else {
            buttonEntry.interaction.action = "toggleVisibility";
            buttonEntry.interaction.target = targetGroup.safeName;
            buttonEntry.interaction.targetName = targetGroup.name;
            buttonEntry.interaction.targetId = targetGroup.id;
            buttonEntry.interaction.targetType = targetGroup.type;
            buttonEntry.interaction.targetRole = targetGroup.groupRole || "";
        }
    } else {
        buttonEntry.interaction.action = "default";
    }
}

function getParentGroupInfo(groupInfoStack) {
    if (!groupInfoStack || groupInfoStack.length === 0) {
        return null;
    }
    return groupInfoStack[groupInfoStack.length - 1];
}

function getGroupPathFromInfo(groupInfoStack) {
    if (!groupInfoStack || groupInfoStack.length === 0) {
        return "";
    }

    var parts = [];
    for (var i = 0; i < groupInfoStack.length; i++) {
        parts.push(groupInfoStack[i].safeName);
    }
    return parts.join("/");
}

function getGroupPathPartsFromInfo(groupInfoStack) {
    var parts = [];
    if (!groupInfoStack) return parts;
    for (var i = 0; i < groupInfoStack.length; i++) {
        parts.push(groupInfoStack[i].safeName);
    }
    return parts;
}


function getGroupIdPathFromInfo(groupInfoStack) {
    var ids = [];
    if (!groupInfoStack) return ids;
    for (var i = 0; i < groupInfoStack.length; i++) {
        ids.push(groupInfoStack[i].id);
    }
    return ids;
}

function getRootGroupInfo(groupInfoStack) {
    if (!groupInfoStack || groupInfoStack.length === 0) {
        return null;
    }
    return groupInfoStack[0];
}

function hideAllLayers(container) {
    for (var i = 0; i < container.layers.length; i++) {
        var layer = container.layers[i];
        layer.visible = false;

        if (layer.typename === "LayerSet") {
            hideAllLayers(layer);
        }
    }
}

// Backward-compatible alias used by older layer export code.
function hideAllArtLayers(container) {
    hideAllLayers(container);
}

function getLayerByIndexPath(container, indexPath) {
    var current = container;
    var layer = null;

    for (var i = 0; i < indexPath.length; i++) {
        var idx = indexPath[i];
        if (!current || !current.layers || idx === undefined || idx === null || idx < 0 || idx >= current.layers.length) {
            return null; // index out of range — skip, do not crash
        }
        layer = current.layers[idx];
        if (!layer) { return null; }
        if (i < indexPath.length - 1) {
            current = layer;
        }
    }

    return layer;
}

function showVisibleChildren(container) {
    // Important for STATE_* export:
    // If we hide everything, then only turn the STATE group back on,
    // Photoshop still keeps the group's child layers hidden. This produced blank PNGs.
    // Restore all children inside the selected group so the flattened state texture renders.
    for (var i = 0; i < container.layers.length; i++) {
        var layer = container.layers[i];
        layer.visible = true;

        if (layer.typename === "LayerSet") {
            showVisibleChildren(layer);
        }
    }
}

function hideSiblingLayers(layer)
{
if (!layer || !layer.parent || !layer.parent.layers)
{
    return;
}

var parent = layer.parent;

for (var i = 0; i < parent.layers.length; i++)
{
    var sibling = parent.layers[i];

    if (sibling !== layer)
    {
        sibling.visible = false;
    }
}
}

function revealIndexPath(container, indexPath) {
    // Reveal every ancestor in the path. Nested STATE_* groups are hidden if the parent
    // BTN_* group remains hidden after hideAllLayers().
    var current = container;
    var layer = null;

    for (var i = 0; i < indexPath.length; i++) {
        layer = current.layers[indexPath[i]];
        layer.visible = true;

        if (i < indexPath.length - 1) {
            current = layer;
        }
    }

    return layer;
}

function exportVisibleThingPng(sourceDoc, indexPath, outFileFsPath) {
    // Zero-copy export: duplicate ONLY the target layer/group into a fresh
    // document sized to that layer's bounds. The source document is never
    // modified (no hide-all, no trim).

    var targetLayer = getLayerByIndexPath(sourceDoc, indexPath);
    if (!targetLayer) {
        warnings.push("exportVisibleThingPng: layer not found at index path " + indexPath + " — skipped.");
        return; // skip, do not throw
    }

    var bounds = targetLayer.bounds;
    var w = Math.round(Number(bounds[2].as("px")) - Number(bounds[0].as("px")));
    var h = Math.round(Number(bounds[3].as("px")) - Number(bounds[1].as("px")));

    if (w <= 0 || h <= 0) {
        warnings.push("exportVisibleThingPng: layer has zero size (" + targetLayer.name + ") — skipped.");
        return; // skip, do not throw
    }

    // Create a new blank document exactly the size of the layer's bounding box.
    // app.documents.add() makes the new doc the frontmost/active document, so we
    // must re-activate the source doc before calling layer.duplicate().
    var exportDoc = app.documents.add(w, h, sourceDoc.resolution,
        "export_tmp", NewDocumentMode.RGB, DocumentFill.TRANSPARENT);

    try {
        // Bring the source document back to front so duplicate() works.
        app.activeDocument = sourceDoc;

        // Duplicate the layer (or group) into the export document.
        var dupLayer = targetLayer.duplicate(exportDoc, ElementPlacement.PLACEATBEGINNING);

        // Switch to the export doc to move the layer and save.
        app.activeDocument = exportDoc;

        // Nudge the duplicated content so its top-left aligns with the canvas origin.
        var dupBounds = dupLayer.bounds;
        var offX = -Number(dupBounds[0].as("px"));
        var offY = -Number(dupBounds[1].as("px"));
        if (Math.abs(offX) > 0.5 || Math.abs(offY) > 0.5) {
            dupLayer.translate(offX, offY);
        }

        var outFile = new File(outFileFsPath);
        var opts    = new ExportOptionsSaveForWeb();
        opts.format         = SaveDocumentType.PNG;
        opts.PNG8           = false;
        opts.transparency   = true;
        opts.interlaced     = false;
        opts.includeProfile = false;
        opts.optimized      = true;
        opts.quality        = 100;

        exportDoc.exportDocument(outFile, ExportType.SAVEFORWEB, opts);
    } finally {
        exportDoc.close(SaveOptions.DONOTSAVECHANGES);
        // Always restore focus to the source document.
        try { app.activeDocument = sourceDoc; } catch (e) {}
    }
}

function exportSingleLayerPng(sourceDoc, indexPath, outFileFsPath) {
    var layer = getLayerByIndexPath(sourceDoc, indexPath);
    if (!layer) {
        warnings.push("exportSingleLayerPng: layer not found at index path " + indexPath + " — skipped.");
        return;
    }
    if (layer.typename !== "ArtLayer") {
        warnings.push("exportSingleLayerPng: expected ArtLayer but got " + layer.typename + " (" + layer.name + ") — skipped.");
        return;
    }
    exportVisibleThingPng(sourceDoc, indexPath, outFileFsPath);
}

function exportGroupPng(sourceDoc, indexPath, outFileFsPath) {
    var layer = getLayerByIndexPath(sourceDoc, indexPath);
    if (!layer) {
        warnings.push("exportGroupPng: group not found at index path " + indexPath + " — skipped.");
        return;
    }
    if (layer.typename !== "LayerSet") {
        warnings.push("exportGroupPng: expected LayerSet but got " + layer.typename + " (" + layer.name + ") — skipped.");
        return;
    }
    exportVisibleThingPng(sourceDoc, indexPath, outFileFsPath);
}

var reuseTexturesByName = true;
var exportedTextureByBaseSafeName = {};
var exportedIdenticalTextureAsset = null; // Deprecated: explicit grouped sharing uses identicalTextureGroups.

function tryResolveIdenticalTextureGroup(textureName)
{
var name = String(textureName || "");

// Explicit marker form:
// IMG_Normal_IDN_A
// BTN_LoadGame_STATE_hovered_IDN_A
var idnMatch = name.match(/_IDN_([A-Z0-9]+)$/i);
if (idnMatch)
{
    return idnMatch[1].toLowerCase();
}

// Simple explicit suffix form:
// IMG_Hover_A
// IMG_Pressed_B
// IMG_Thumb_Level1_C
// IMG_Thumb_Level3_B
// BTN_LoadGame_STATE_hovered_A
//
// IMPORTANT: generated state names without explicit suffix, like
// BTN_LoadGame_STATE_normal, must NOT share by "normal".
var simpleMatch = name.match(/^(.*)_([A-Z0-9]+)$/i);
if (!simpleMatch)
{
    return null;
}

var baseName = simpleMatch[1];
var suffix = simpleMatch[2];

// Do not treat actual state names as sharing groups.
if (/^(normal|hover|hovered|pressed|down|disabled)$/i.test(suffix))
{
    return null;
}

// Accept a single uppercase letter A-Z as a sharing-group key for any
// known image-type prefix layer: IMG_, BG_, ICO_, THM_, BAR_, FILL_, RTHM_, etc.
// This covers names like IMG_Thumb_Level1_C, BG_Panel_B, ICO_Star_D.
if (/^[A-Z]$/.test(suffix) &&
    /^(IMG_|BG_|ICO_|THM_|BAR_|FILL_|RTHM_|BOX_|CHKMARK_)/i.test(name))
{
    return suffix.toLowerCase();
}

// Keep existing logic: any alphanumeric suffix on a button-state base name is a sharing key.
if (/IMG_(Normal|Hover|Hovered|Pressed|Down|Disabled)$/i.test(baseName) ||
    /_STATE_(normal|hovered|pressed|disabled)$/i.test(baseName))
{
    return suffix.toLowerCase();
}

return null;
}

function exportSingleLayerPngOnceByName(sourceDoc, indexPath, baseSafeName) {
    // Cancel support: bail early if user clicked Cancel in the progress window.
    if (_exportCancelled) {
        throw new Error("Export cancelled by user.");
    }

    var textureName = sanitizeName(baseSafeName || "Texture");
    var cleanTextureNameForExport = stripIdenticalSuffixForDisplay(textureName);
    var groupKey = tryResolveIdenticalTextureGroup(textureName);

    // IMPORTANT:
    // Do NOT reuse by matching layer/texture name anymore.
    // Two layers called IMG_Normal in different button groups are not automatically identical.
    // Texture sharing happens ONLY when the designer explicitly marks the layer name with
    // a sharing suffix, for example:
    //   IMG_Normal_IDN_A
    //   IMG_Hover_A
    //   IMG_Pressed_B
    if (groupKey && identicalTextureGroups[groupKey])
    {
        return identicalTextureGroups[groupKey];
    }

    var finalTextureName = cleanTextureNameForExport;
    var assetPath = "Textures/" + finalTextureName + ".png";
    var fsPath = texFolder.fsName + "/" + finalTextureName + ".png";

    // Skip-existing mode: if the PNG is already on disk and the caller asked to
    // skip unchanged files, reuse the path without re-exporting.
    var existingFile = new File(fsPath);
    if (skipExisting && existingFile.exists) {
        if (groupKey) { identicalTextureGroups[groupKey] = assetPath; }
        return assetPath;
    }

    // Overwrite mode: re-export every time (no _2, _3 duplicates).
    _exportCount++;
    updateProgress(_exportCount, _exportTotal, cleanTextureNameForExport);
    exportSingleLayerPng(sourceDoc, indexPath, fsPath);

    if (groupKey)
    {
        identicalTextureGroups[groupKey] = assetPath;
    }

    return assetPath;
}

var baseDocName = doc.name.replace(/\.[^\.]+$/, "");
var usedSafeNames = {};
var warnings = [];
var exportedLayers = [];
var exportedGroups = [];
var zOrderCounter = 0;
var layerCounter = 1;
var groupCounter = 1;
var _exportCount = 0;
var _exportTotal = 0;

// ========== AUTO-FILL FUNCTION (MOVED INSIDE runExporter) ==========
function autoFillMissingButtonStates() {
    if (!autoFillBtnStates) return;
    for (var i = 0; i < exportedGroups.length; i++) {
        var group = exportedGroups[i];
        if (group.type !== "button") continue;
        var states = group.buttonStates;
        if (!states) continue;
        var foundAsset = null;
        var order = ["normal", "hovered", "pressed"];
        for (var o = 0; o < order.length; o++) {
            var key = order[o];
            if (states[key] && states[key].asset) {
                foundAsset = states[key].asset;
                break;
            }
        }
        if (!foundAsset) continue;
        for (var o2 = 0; o2 < order.length; o2++) {
            var missingKey = order[o2];
            if (!states[missingKey]) {
                states[missingKey] = {
                    name: missingKey.charAt(0).toUpperCase() + missingKey.slice(1),
                    state: missingKey,
                    asset: foundAsset,
                    x: group.x,
                    y: group.y,
                    width: group.width,
                    height: group.height,
                    drawType: "Image",
                    margin: [0.25, 0.25, 0.25, 0.25]
                };
            }
        }
    }
}
// ========== END AUTO-FILL FUNCTION ==========

// ---------------------------------------------------------------------------
// ---------------------------------------------------------------------------
// Read an explicit rotation angle declared in a BTN_ group layer name.
//
// When the button's visual tilt is baked into the PNG pixels (drawn at an
// angle in Photoshop, not Free-Transformed), no PS matrix angle exists to
// detect automatically.  The designer declares the angle in the layer name:
//
//   BTN_Players ROT_-15   ->  rotation = -15 degrees on the UButton
//   BTN_Weapons ROT_10    ->  rotation =  10 degrees on the UButton
//   BTN_Close ROT_0       ->  rotation =   0 (explicit override)
//
// The ROT_ token is stripped by sanitizeName so UMG widget names stay clean.
// Returns NaN when no ROT_ token is found (caller falls back to PS detection).
// ---------------------------------------------------------------------------
function getButtonRotationFromName(rawName) {
    var m = String(rawName || "").match(/ROT_(-?[0-9]+(?:\.[0-9]+)?)/i);
    return (m && m[1] !== undefined) ? Number(m[1]) : NaN;
}

// Read the rotation angle (degrees) that Photoshop has applied to a layer.
//
// Works for:
//   - Smart Object ArtLayers  (placed.transform or transform descriptor)
//   - Regular ArtLayers that were individually Free-Transformed
//   - Text layers             (textItem.transform matrix)
//
// For regular LayerSet groups that were rotated with Free Transform, PS bakes
// the rotation into each child's pixel data and position — the group itself
// stores no angle.  Use getButtonGroupRotation() for that case instead.
//
// Returns 0 if no rotation is found.
// ---------------------------------------------------------------------------
function getLayerRotationAngle(layer) {
    // ── Text layer: transform is a 2×3 matrix [a, b, c, d, tx, ty] ────────
    try {
        if (layer.kind === LayerKind.TEXT) {
            var tf = layer.textItem.transform;
            // tf[0]=a (xx), tf[1]=b (xy)  →  angle = atan2(b, a)
            var angleDeg = Math.atan2(tf[1], tf[0]) * (180.0 / Math.PI);
            angleDeg = Math.round(angleDeg * 10000) / 10000;
            if (Math.abs(angleDeg) > 0.001) { return angleDeg; }
        }
    } catch (e) {}

    // ── ActionDescriptor approach (Smart Objects, Free-Transformed pixels) ─
    try {
        var ref = new ActionReference();
        ref.putIdentifier(charIDToTypeID("Lyr "), layer.id);
        var desc = executeActionGet(ref);

        // Smart Object: rotation is inside the "placed" sub-descriptor.
        if (desc.hasKey(stringIDToTypeID("placed"))) {
            var placed = desc.getObjectValue(stringIDToTypeID("placed"));
            if (placed.hasKey(stringIDToTypeID("transform"))) {
                var tfDesc = placed.getObjectValue(stringIDToTypeID("transform"));
                var xx = tfDesc.hasKey(stringIDToTypeID("xx")) ? tfDesc.getDoubleValue(stringIDToTypeID("xx")) : 1.0;
                var xy = tfDesc.hasKey(stringIDToTypeID("xy")) ? tfDesc.getDoubleValue(stringIDToTypeID("xy")) : 0.0;
                var angleDeg = Math.atan2(xy, xx) * (180.0 / Math.PI);
                angleDeg = Math.round(angleDeg * 10000) / 10000;
                if (Math.abs(angleDeg) > 0.001) { return angleDeg; }
            }
        }

        // Direct "transform" key (some PS versions store it here for pixel layers).
        if (desc.hasKey(stringIDToTypeID("transform"))) {
            var tfDesc = desc.getObjectValue(stringIDToTypeID("transform"));
            var xx = tfDesc.hasKey(stringIDToTypeID("xx")) ? tfDesc.getDoubleValue(stringIDToTypeID("xx")) : 1.0;
            var xy = tfDesc.hasKey(stringIDToTypeID("xy")) ? tfDesc.getDoubleValue(stringIDToTypeID("xy")) : 0.0;
            var angleDeg = Math.atan2(xy, xx) * (180.0 / Math.PI);
            angleDeg = Math.round(angleDeg * 10000) / 10000;
            if (Math.abs(angleDeg) > 0.001) { return angleDeg; }
        }
    } catch (e) {}

    return 0;
}

// ---------------------------------------------------------------------------
// For a BTN_ LayerSet group, find the rotation angle that should be applied
// to the UButton widget in UMG.
//
// A designer typically rotates the button by either:
//   (a) Placing a Smart Object inside the BTN_ group and rotating THAT object.
//   (b) Rotating individual child layers inside the BTN_ group.
//
// In both cases Photoshop stores the rotation on the CHILD layers, not on the
// parent group.  This function scans the direct children (skipping state-art
// layers like IMG_Normal/Hover/Pressed) and returns the angle of the first
// child that has a non-zero rotation.
//
// The returned angle is then stored on the button GROUP entry so the UMG
// importer can apply it to UButton.SetRenderTransformAngle().
// All children are exported with rotation = 0 (they don't rotate individually;
// the parent button's angle rotates them as a unit).
// ---------------------------------------------------------------------------
function getButtonGroupRotation(groupLayer) {
    if (!groupLayer || !groupLayer.layers) { return 0; }

    // Priority 0 — explicit ROT_ token in the layer name.
    // Authoritative override when the tilt is baked into PNG pixel data and
    // cannot be read from a Photoshop transform matrix.
    var nameAngle = getButtonRotationFromName(groupLayer.name);
    if (!isNaN(nameAngle)) { return nameAngle; }

    // Pass 1 — scan non-state children (TXT_, Smart Objects, content art).
    // Covers buttons where the designer Free-Transformed a child layer.
    try {
        for (var i = 0; i < groupLayer.layers.length; i++) {
            var child = groupLayer.layers[i];
            if (!child || !child.visible) { continue; }
            if (isButtonStateLayerName(child.name)) { continue; }
            var angle = getLayerRotationAngle(child);
            if (Math.abs(angle) > 0.001) { return angle; }
        }
    } catch (e) {}

    // Pass 2 — fallback: scan state-art layers (IMG_Normal, IMG_Hover, etc.).
    // When the entire button visual IS the state texture, the state layer's
    // own PS transform angle is the button's rotation.
    try {
        for (var j = 0; j < groupLayer.layers.length; j++) {
            var stateChild = groupLayer.layers[j];
            if (!stateChild || !stateChild.visible) { continue; }
            if (!isButtonStateLayerName(stateChild.name)) { continue; }
            // STATE_ groups: scan their children too.
            if (stateChild.typename === "LayerSet" && stateChild.layers) {
                for (var k = 0; k < stateChild.layers.length; k++) {
                    var inner = stateChild.layers[k];
                    if (!inner) { continue; }
                    var ia = getLayerRotationAngle(inner);
                    if (Math.abs(ia) > 0.001) { return ia; }
                }
            }
            var sa = getLayerRotationAngle(stateChild);
            if (Math.abs(sa) > 0.001) { return sa; }
        }
    } catch (e) {}

    return 0;
}

function addGroupEntry(groupLayer, parentGroupStack, localZOrder) {
    var rawName = groupLayer.name;
    var baseSafeName = sanitizeName(rawName);
    var safeName = makeUniqueName(baseSafeName, usedSafeNames);
    var bounds = getBounds(groupLayer);
    var docWidth = px(doc.width);
    var docHeight = px(doc.height);
    var groupType = getGroupType(rawName);
    var parentInfo = getParentGroupInfo(parentGroupStack);
    var rootInfo = getRootGroupInfo(parentGroupStack);
    var parentPath = getGroupPathFromInfo(parentGroupStack);
    var parentPathParts = getGroupPathPartsFromInfo(parentGroupStack);
    var groupIdPath = getGroupIdPathFromInfo(parentGroupStack);
    var groupRole = getGroupRole(rawName, parentGroupStack);
    var parentBounds = parentInfo ? parentInfo.bounds : null;
    var localX = parentBounds ? bounds.x - parentBounds.x : bounds.x;
    var localY = parentBounds ? bounds.y - parentBounds.y : bounds.y;

    var groupId = "group_" + groupCounter;
    groupCounter++;

    var displayGroupRawName = stripIdenticalSuffixForDisplay(rawName);
    var displayGroupSafeName = sanitizeName(displayGroupRawName);

    var entry = {
        id: groupId,
        name: displayGroupRawName,
        safeName: displayGroupSafeName,
        type: groupType,
        groupRole: groupRole,
        isGroup: true,
        isTopLevel: parentInfo ? false : true,
        depth: parentGroupStack ? parentGroupStack.length : 0,
        widgetType: getWidgetTypeForGroup(groupType),
        groupPath: parentPath,
        groupIdPath: groupIdPath,
        path: parentPath ? parentPath + "/" + safeName : safeName,
        parent: parentInfo ? parentInfo.safeName : "",
        parentId: parentInfo ? parentInfo.id : "",
        rootGroup: rootInfo ? rootInfo.safeName : safeName,
        rootGroupId: rootInfo ? rootInfo.id : groupId,
        x: bounds.x,
        y: bounds.y,
        localX: localX,
        localY: localY,
        parentX: parentBounds ? parentBounds.x : 0,
        parentY: parentBounds ? parentBounds.y : 0,
        width: bounds.width,
        height: bounds.height,
        zOrder: (typeof localZOrder === "number") ? localZOrder : zOrderCounter,
        visible: groupLayer.visible === true,
        opacity: Number(groupLayer.opacity) / 100.0,
        // For button groups: lift the rotation off the children and store it on the
        // group itself so the UMG importer can apply it to UButton.Transform.Angle.
        // For all other group types: rotation is 0 (groups don't rotate in UMG).
        rotation: (groupType === "button") ? getButtonGroupRotation(groupLayer) : 0,
        scale: [1.0, 1.0],
        pivot: (groupType === "button" || groupType === "slider" || groupType === "radialSlider" || groupType === "checkbox" || groupType === "textInput" || groupType === "textInputMultiLine" || groupType === "editableTextBox" || groupType === "editableTextBoxMultiLine" || groupType === "comboBox" || groupType === "spinBox" || groupType === "progressBar" || groupType === "border" || groupType === "wrapBox" || groupType === "uniformGridPanel" || groupType === "gridPanel" || groupType === "listView" || groupType === "tileView" || groupType === "treeView" || groupType === "widgetSwitcher" || groupType === "scrollBox" || groupType === "checkboxGroup") ? [0.5, 0.5] : [0.0, 0.0],
        anchorPreset: getAnchorPreset(bounds, parentBounds),
        children: [],
        tags: getTagsForLayer(groupType, rawName, parentPathParts, groupRole)
    };

    if (groupType === "spacer" || groupRole === "spacer") {
        entry.layoutMode = "spacer";
        var spacerSize = getSpacerSize(rawName);
        entry.spacingX = spacerSize[0];
        entry.spacingY = spacerSize[1];
        entry.spacingValue = Math.max(entry.spacingX, entry.spacingY);
        entry.spacerSize = spacerSize;
        entry.childPositionMode = "none";
    }

    if (groupType === "horizontalBox" || groupRole === "horizontalBox") {
        entry.layoutMode = "auto";
        entry.orientation = "horizontal";
        entry.childPositionMode = "slotOrder";
        entry.childSlot = {
            sizeRule: "Auto",
            horizontalAlignment: "Center",
            verticalAlignment: "Center",
            padding: [0, 0, 0, 0]
        };
    }

    if (groupType === "verticalBox" || groupRole === "verticalBox") {
        entry.layoutMode = "auto";
        entry.orientation = "vertical";
        entry.childPositionMode = "slotOrder";
        entry.childSlot = {
            sizeRule: "Auto",
            horizontalAlignment: "Center",
            verticalAlignment: "Center",
            padding: [0, 0, 0, 0]
        };
    }


    if (groupType === "wrapBox" || groupRole === "wrapBox") {
        entry.layoutMode = "auto";
        entry.orientation = "wrap";
        entry.childPositionMode = "slotOrder";
        entry.flowDirection = "leftToRight";
        entry.wrapSize = bounds.width;
        entry.childSlot = {
            horizontalAlignment: "Center",
            verticalAlignment: "Center",
            padding: [0, 0, 0, 0],
            fillEmptySpace: false,
            fillSpanWhenLessThan: 0
        };
    }

    if (groupType === "uniformGridPanel" || groupRole === "uniformGridPanel") {
        entry.layoutMode = "auto";
        entry.orientation = "uniformGrid";
        entry.childPositionMode = "slotOrder";
        entry.gridColumns = getUniformGridColumns(rawName);
        entry.gridRows = getUniformGridRows(rawName);
        entry.childSlot = {
            horizontalAlignment: "Fill",
            verticalAlignment: "Fill",
            padding: [0, 0, 0, 0]
        };
    }

    if (groupType === "gridPanel" || groupRole === "gridPanel") {
        entry.layoutMode = "auto";
        entry.orientation = "grid";
        entry.childPositionMode = "slotOrder";
        entry.gridColumns = getGridPanelColumns(rawName);
        entry.gridRows = getGridPanelRows(rawName);
        entry.childSlot = {
            horizontalAlignment: "Fill",
            verticalAlignment: "Fill",
            padding: [0, 0, 0, 0]
        };
    }

    if (groupType === "listView" || groupRole === "listView") {
        entry.layoutMode = "listView";
        entry.orientation = "vertical";
        entry.childPositionMode = "dataView";
        entry.itemHeight = 24;
        entry.consumeMouseWheel = "WhenScrollingPossible";
    }

    if (groupType === "tileView" || groupRole === "tileView") {
        entry.layoutMode = "tileView";
        entry.orientation = "tile";
        entry.childPositionMode = "dataView";
        entry.entryWidth = 128;
        entry.entryHeight = 128;
        entry.consumeMouseWheel = "WhenScrollingPossible";
    }

    if (groupType === "treeView" || groupRole === "treeView") {
        entry.layoutMode = "treeView";
        entry.orientation = "tree";
        entry.childPositionMode = "dataView";
        entry.itemHeight = 24;
        entry.consumeMouseWheel = "WhenScrollingPossible";
    }

    if (groupType === "widgetSwitcher" || groupRole === "widgetSwitcher") {
        entry.layoutMode = "widgetSwitcher";
        entry.orientation = "stackedPages";
        entry.childPositionMode = "slotOrder";
        entry.activeWidgetIndex = 0;
        entry.childSlot = {
            horizontalAlignment: "Fill",
            verticalAlignment: "Fill",
            padding: [0, 0, 0, 0]
        };
    }

    if (groupType === "scrollBox" || groupRole === "scrollBox") {
        entry.layoutMode = "auto";
        entry.orientation = getScrollBoxOrientation(rawName);
        entry.scrollOrientation = entry.orientation;
        entry.customSize = isScrollBoxCustomSizeName(rawName);
        entry.customScrollBoxSize = entry.customSize;
        entry.viewportSizeFromBounds = entry.customSize;
        entry.childPositionMode = "slotOrder";
        entry.consumeMouseWheel = "WhenScrollingPossible";
        entry.allowOverscroll = true;
        entry.alwaysShowScrollbar = false;
        entry.expectedParts = ["scrollBoxBar", "scrollBoxThumb"];
        entry.style = {
            barImagePart: "scrollBoxBar",
            thumbImagePart: "scrollBoxThumb"
        };
        entry.childSlot = {
            horizontalAlignment: "Fill",
            verticalAlignment: "Fill",
            padding: [0, 0, 0, 0]
        };
    }

    if (groupType === "safeZone" || groupRole === "safeZone") {
        entry.layoutMode = "safeZone";
        entry.orientation = "singleChild";
        entry.childPositionMode = "singleChild";
    }

    if (groupType === "scaleBox" || groupRole === "scaleBox") {
        entry.layoutMode = "scaleBox";
        entry.orientation = "singleChild";
        entry.childPositionMode = "singleChild";
        entry.stretch = "ScaleToFit";
        entry.stretchDirection = "Both";
    }

    if (groupType === "sizeBox" || groupRole === "sizeBox") {
        entry.layoutMode = "sizeBox";
        entry.orientation = "singleChild";
        entry.childPositionMode = "singleChild";
        entry.overrideWidth = bounds.width;
        entry.overrideHeight = bounds.height;
    }

    if (groupType === "stackBox" || groupRole === "stackBox") {
        entry.layoutMode = "auto";
        entry.orientation = getStackBoxOrientation(rawName);
        entry.stackOrientation = entry.orientation;
        entry.childPositionMode = "slotOrder";
        entry.childSlot = {
            horizontalAlignment: "Fill",
            verticalAlignment: "Fill",
            padding: [0, 0, 0, 0]
        };
    }

    if (groupType === "overlay" || groupRole === "overlay") {
        entry.layoutMode = "overlay";
        entry.orientation = "overlay";
        entry.childPositionMode = "overlay";
        entry.childSlot = {
            horizontalAlignment: "Fill",
            verticalAlignment: "Fill",
            padding: [0, 0, 0, 0]
        };
    }

    if (groupType === "comboBox" || groupRole === "comboBox") {
        entry.interactionKey = getInteractionKey(rawName);
        entry.placeholder = "";
        entry.selectedOption = "";
        entry.options = [];
        entry.drawType = "Box";
        entry.margin = [0.25, 0.25, 0.25, 0.25];
        entry.childPositionMode = "absolute";
    }

    if (groupType === "spinBox" || groupRole === "spinBox") {
        entry.interactionKey = getInteractionKey(rawName);
        entry.value = 0;
        entry.minValue = 0;
        entry.maxValue = 100;
        entry.stepSize = 1;
        entry.drawType = "Box";
        entry.margin = [0.25, 0.25, 0.25, 0.25];
        entry.childPositionMode = "absolute";
    }

    if (groupType === "progressBar") {
        entry.valueWidget   = true;
        entry.valueType     = "float";
        entry.defaultValue  = 1.0;
        entry.percent       = 1.0;
        entry.expectedParts = ["progressBarBackground", "progressBarFill"];
        entry.optionalParts = ["progressBarLabel"];
        entry.style = {
            backgroundImagePart: "progressBarBackground",
            fillImagePart:       "progressBarFill"
        };
        entry.childPositionMode = "absolute";

        // ── Derive barPadding from FILL_Bar vs BG_Bar positional offset ──
        // The pixel inset of FILL_Bar inside BG_Bar in Photoshop maps directly
        // to UProgressBar::BarPadding in Unreal, reproducing the design exactly.
        try {
            var pgbLayer   = groupLayer;
            var bgBounds   = null;
            var fillBounds = null;

            for (var ci = 0; ci < pgbLayer.layers.length; ci++) {
                var child     = pgbLayer.layers[ci];
                var childName = String(child.name || "");
                if (!bgBounds && (
                        startsWith(childName, "BG_Bar")      ||
                        startsWith(childName, "BG_Progress") ||
                        startsWith(childName, "BG_"))) {
                    bgBounds = getBounds(child);
                }
                if (!fillBounds && (
                        startsWith(childName, "FILL_Bar")      ||
                        startsWith(childName, "FILL_Progress") ||
                        startsWith(childName, "FILL_"))) {
                    fillBounds = getBounds(child);
                }
            }

            if (bgBounds && fillBounds) {
                var padLeft   = Math.round(fillBounds.x - bgBounds.x);
                var padTop    = Math.round(fillBounds.y - bgBounds.y);
                var padRight  = Math.round((bgBounds.x + bgBounds.width)  - (fillBounds.x + fillBounds.width));
                var padBottom = Math.round((bgBounds.y + bgBounds.height) - (fillBounds.y + fillBounds.height));

                if (padLeft !== 0 || padTop !== 0 || padRight !== 0 || padBottom !== 0) {
                    entry.barPadding = [padLeft, padTop, padRight, padBottom];
                }
            }
        } catch (pgbErr) { /* non-fatal — barPadding simply omitted */ }
    }

    if (groupRole === "screen" || groupType === "canvas") {
        entry.isScreenCanvas = true;
        entry.screenName = safeName.replace(/^CAN_/, "");
        entry.wrapper = {
            safeZone: true,
            scaleBox: true,
            scaleBoxStretch: "ScaleToFit",
            scaleBoxStretchDirection: "Both",
            contentWidgetType: "CanvasPanel"
        };
    }

    if (groupType === "button") {
        entry.interaction = {
            event: getInteractionName(rawName)
        };
        entry.drawType = "Box";
        entry.margin = [0.25, 0.25, 0.25, 0.25];
    }

    if (groupType === "slider") {
        entry.valueWidget = true;
        entry.valueType = "float";
        entry.defaultValue = 0.5;
        entry.orientation = bounds.width >= bounds.height ? "horizontal" : "vertical";
        entry.expectedParts = ["sliderBar", "sliderThumb"];
        entry.optionalParts = ["sliderFillBar", "sliderLabel"];
        entry.style = {
            barImagePart: "sliderBar",
            fillImagePart: "sliderFillBar",
            thumbImagePart: "sliderThumb"
        };
    }

    if (groupType === "radialSlider") {
        entry.valueWidget = true;
        entry.valueType = "float";
        entry.defaultValue = 0.5;
        entry.widgetSubtype = "radialSlider";
        entry.expectedParts = ["radialSliderSizeReference", "radialSliderThumb"];
        entry.optionalParts = [];
        entry.style = {
            thumbImagePart: "radialSliderThumb"
        };
    }

    if (groupType === "checkbox") {
        entry.valueWidget = true;
        entry.valueType = "boolean";
        entry.defaultChecked = false;
        entry.checkboxType = isToggleCheckboxName(rawName) ? "ToggleButton" : "CheckBox";
        entry.expectedParts = ["checkboxBox", "checkboxCheckmark"];
        entry.optionalParts = ["checkboxLabel"];
        entry.style = {
            checkBoxType: entry.checkboxType,
            uncheckedImagePart: "checkboxBox",
            checkedImagePart: "checkboxCheckmark"
        };
    }

    // GROUPED CHECKBOX MODIFICATION
    if (groupType === "checkboxGroup") {
        entry.isCheckboxGroup = true;
        entry.layoutMode = "checkboxGroup";
        entry.widgetType = "CanvasPanel";
        entry.childPositionMode = "absolute";
    }

    // GROUPED CHECKBOX MODIFICATION - when a CHK_/TGL_ group sits directly inside
    // a CHKG_ container, pre-stamp the group-membership fields immediately.
    // collectCheckboxGroupItems() will overwrite these with the final index values,
    // but stamping here ensures the UE importer accumulator sees the field even if
    // collectCheckboxGroupItems() is skipped or runs before the entry is indexed.
    if ((groupType === "checkbox") && parentInfo && parentInfo.type === "checkboxGroup") {
        var rawParentSafe  = parentInfo.safeName || parentInfo.name || "";
        entry.checkboxGroupId         = parentInfo.id;
        entry.checkboxGroupSafeName   = rawParentSafe.replace(/^CHKG_/i, "");
        entry.checkboxGroupIndex      = 0; // refined to correct index by collectCheckboxGroupItems
    }

    if (groupType === "textInput" || groupType === "textInputMultiLine" || groupType === "editableTextBox" || groupType === "editableTextBoxMultiLine") {
        entry.valueWidget = true;
        entry.valueType = "text";
        entry.inputWidget = true;
        entry.isMultiLine = (groupType === "textInputMultiLine" || groupType === "editableTextBoxMultiLine");
        entry.hasBoxChrome = (groupType === "editableTextBox" || groupType === "editableTextBoxMultiLine");
        entry.defaultText = "";
        entry.placeholder = "";
        entry.expectedParts = entry.hasBoxChrome ? ["inputBackground"] : [];
        entry.optionalParts = ["placeholderText"];
        entry.style = {
            backgroundImagePart: "inputBackground",
            placeholderTextPart: "placeholderText"
        };
    }

    addChildToParent(parentInfo, displayGroupSafeName, groupId, "group", groupType, groupRole);

    zOrderCounter++;
    exportedGroups.push(entry);

    return {
        id: groupId,
        safeName: safeName,
        name: rawName,
        type: groupType,
        role: groupRole,
        bounds: bounds,
        entry: entry
    };
}

function addChildToParent(parentInfo, childSafeName, childId, childKind, childType, childRole) {
    if (!parentInfo || !parentInfo.entry || !parentInfo.entry.children) {
        return;
    }

    parentInfo.entry.children.push({
        id: childId,
        safeName: childSafeName,
        kind: childKind || "layer",
        type: childType || "",
        role: childRole || ""
    });
}

function applyScrollBoxSizeIndicatorToParent(parentInfo, indicatorEntry, indicatorBounds) {
    if (!parentInfo || !parentInfo.entry || !indicatorEntry || !indicatorBounds) {
        return;
    }

    // SCB_S_ / SCR_S_ is only a size indicator for its direct parent.
    // Keep the indicator in JSON, but write its bounds onto whatever parent owns it.
    // This supports both:
    //   SCB_* -> SCB_S_* size marker
    //   HBX_/VBX_/AnyParent -> SCB_S_* size marker
    parentInfo.entry.customSize = true;
    parentInfo.entry.customScrollBoxSize = true;
    parentInfo.entry.viewportSizeFromBounds = true;
    parentInfo.entry.customScrollBoxSizeIndicatorId = indicatorEntry.id;
    parentInfo.entry.customScrollBoxSizeIndicatorName = indicatorEntry.safeName;
    parentInfo.entry.customScrollBoxWidth = indicatorBounds.width;
    parentInfo.entry.customScrollBoxHeight = indicatorBounds.height;
    parentInfo.entry.customScrollBoxLocalX = indicatorEntry.localX;
    parentInfo.entry.customScrollBoxLocalY = indicatorEntry.localY;
    parentInfo.entry.customScrollBoxBounds = {
        x: indicatorBounds.x,
        y: indicatorBounds.y,
        localX: indicatorEntry.localX,
        localY: indicatorEntry.localY,
        width: indicatorBounds.width,
        height: indicatorBounds.height
    };
}

function applyRadialSliderPositionSizeToParent(parentInfo, indicatorEntry, indicatorBounds) {
    if (!parentInfo || !parentInfo.entry || !indicatorEntry || !indicatorBounds) {
        return;
    }

    // For RadialSlider groups, BAR_ only defines the parent widget position and size.
    // No extra bounds metadata is exported.
    parentInfo.entry.x = indicatorBounds.x;
    parentInfo.entry.y = indicatorBounds.y;
    parentInfo.entry.localX = indicatorEntry.localX;
    parentInfo.entry.localY = indicatorEntry.localY;
    parentInfo.entry.width = indicatorBounds.width;
    parentInfo.entry.height = indicatorBounds.height;
}

function isGridPanelEntry(entry) {
    if (!entry) {
        return false;
    }

    return entry.type === "gridPanel" ||
        entry.groupRole === "gridPanel" ||
        entry.widgetType === "GridPanel" ||
        entry.orientation === "grid";
}

function isUniformGridPanelEntry(entry) {
    if (!entry) {
        return false;
    }

    return entry.type === "uniformGridPanel" ||
        entry.groupRole === "uniformGridPanel" ||
        entry.widgetType === "UniformGridPanel";
}

function pushUniqueSortedNumber(values, value, tolerance) {
    for (var i = 0; i < values.length; i++) {
        if (Math.abs(values[i] - value) <= tolerance) {
            return;
        }
    }

    values.push(value);
    values.sort(function (a, b) { return a - b; });
}

function findSlotIndex(values, value, tolerance) {
    var bestIndex = 0;
    var bestDistance = 999999999;

    for (var i = 0; i < values.length; i++) {
        var distance = Math.abs(values[i] - value);
        if (distance < bestDistance) {
            bestDistance = distance;
            bestIndex = i;
        }
    }

    return bestDistance <= tolerance ? bestIndex : bestIndex;
}

function countSlotSpan(values, startIndex, startValue, sizeValue, tolerance) {
    var rightOrBottom = startValue + sizeValue;
    var span = 1;

    for (var i = startIndex + 1; i < values.length; i++) {
        if (values[i] < rightOrBottom - tolerance) {
            span++;
        }
    }

    return Math.max(1, span);
}

function applyGridPanelSlots() {
    var objectById = {};

    for (var i = 0; i < exportedGroups.length; i++) {
        objectById[exportedGroups[i].id] = exportedGroups[i];
    }

    for (var j = 0; j < exportedLayers.length; j++) {
        objectById[exportedLayers[j].id] = exportedLayers[j];
    }

    var tolerance = 4;

    for (var g = 0; g < exportedGroups.length; g++) {
        var gridEntry = exportedGroups[g];

        if ((!isGridPanelEntry(gridEntry) && !isUniformGridPanelEntry(gridEntry)) || !gridEntry.children || gridEntry.children.length <= 0) {
            continue;
        }

        var childObjects = [];
        var columnStarts = [];
        var rowStarts = [];

        for (var c = 0; c < gridEntry.children.length; c++) {
            var childRef = gridEntry.children[c];
            var childObject = objectById[childRef.id];

            if (!childObject) {
                continue;
            }

            childObjects.push({
                ref: childRef,
                obj: childObject
            });

            pushUniqueSortedNumber(columnStarts, childObject.x, tolerance);
            pushUniqueSortedNumber(rowStarts, childObject.y, tolerance);
        }

        if (childObjects.length <= 0) {
            continue;
        }

        gridEntry.childPositionMode = "gridSlot";
        gridEntry.gridColumns = Math.max(gridEntry.gridColumns || 0, columnStarts.length);
        gridEntry.gridRows = Math.max(gridEntry.gridRows || 0, rowStarts.length);

        // Compute minSlotWidth / minSlotHeight for UUniformGridPanel.
        // Unreal's UUniformGridPanel uses MinDesiredSlotWidth/Height to size cells.
        // Without these the cells collapse to content intrinsic size and all children
        // cluster in the top-left corner of the panel.
        // We derive the cell size from the child bounding boxes: take the max width
        // across all children for minSlotWidth, and max height for minSlotHeight.
        // (For a uniform grid all cells should be the same size by design, so max = cell size.)
        if (isUniformGridPanelEntry(gridEntry)) {
            var maxChildW = 0;
            var maxChildH = 0;
            for (var sc = 0; sc < childObjects.length; sc++) {
                var cobj = childObjects[sc].obj;
                if (cobj.width  > maxChildW) maxChildW = cobj.width;
                if (cobj.height > maxChildH) maxChildH = cobj.height;
            }
            if (maxChildW > 0) gridEntry.minSlotWidth  = maxChildW;
            if (maxChildH > 0) gridEntry.minSlotHeight = maxChildH;
        }

        for (var s = 0; s < childObjects.length; s++) {
            var item = childObjects[s];
            var obj = item.obj;
            var ref = item.ref;

            var column = findSlotIndex(columnStarts, obj.x, tolerance);
            var row = findSlotIndex(rowStarts, obj.y, tolerance);
            var columnSpan = countSlotSpan(columnStarts, column, obj.x, obj.width, tolerance);
            var rowSpan = countSlotSpan(rowStarts, row, obj.y, obj.height, tolerance);

            var gridSlot = {
                row: row,
                column: column,
                rowSpan: rowSpan,
                columnSpan: columnSpan,
                horizontalAlignment: "Fill",
                verticalAlignment: "Fill",
                padding: [0, 0, 0, 0]
            };

            obj.gridSlot = gridSlot;
            obj.uniformGridSlot = gridSlot;
            obj.childSlot = gridSlot;
            ref.gridSlot = gridSlot;
            ref.uniformGridSlot = gridSlot;
        }
    }
}

function addLayerEntry(layer, groupInfoStack, indexPath, localZOrder) {
    if (!layer.visible) {
        return;
    }

    var layerType = getLayerType(layer);
    var rawName = layer.name;
    var baseSafeName = sanitizeName(rawName);
    var safeName = makeUniqueName(baseSafeName, usedSafeNames);
    var bounds = getBounds(layer);

    if (bounds.width <= 0 || bounds.height <= 0) {
        // Empty placeholder widgets are allowed. This lets the user create
        // an empty Photoshop art layer named LSV_/LST_, TLV_/TIL_, TRV_/TVW_,
        // OVL_/OLY_, or GRD_/GDP_/GPN_ and still get a real UMG widget.
        if (layerType === "listView" || layerType === "tileView" || layerType === "treeView" ||
            layerType === "overlay" || layerType === "gridPanel" || layerType === "safeZone" ||
            layerType === "widgetSwitcher" || layerType === "scaleBox" || layerType === "scrollBox" || layerType === "sizeBox" || layerType === "stackBox") {
            bounds.width = 100;
            bounds.height = 100;
        } else if (layerType !== "spacer") {
            warnings.push("Layer skipped because it has empty bounds: " + rawName);
            return;
        }
    }

    if (layerType === "unsupported") {
        warnings.push("Layer skipped because it has unsupported prefix: " + rawName);
        return;
    }

    var docWidth = px(doc.width);
    var docHeight = px(doc.height);
    var parentInfo = getParentGroupInfo(groupInfoStack);
    var rootInfo = getRootGroupInfo(groupInfoStack);
    var groupPathParts = getGroupPathPartsFromInfo(groupInfoStack);
    var groupIdPath = getGroupIdPathFromInfo(groupInfoStack);
    var parentBounds = parentInfo ? parentInfo.bounds : null;
    var localX = parentBounds ? bounds.x - parentBounds.x : bounds.x;
    var localY = parentBounds ? bounds.y - parentBounds.y : bounds.y;
    var parentRole = parentInfo ? parentInfo.role : "";
    var partRole = getCompoundWidgetPartRole(rawName, parentRole);

    // Direct button-state image layers are style brushes, not button content widgets.
    // Designer structure:
    //   BTN_Play
    //     IMG_Normal
    //     IMG_Hover
    //     IMG_Pressed
    //     IMG_Disabled
    if (parentInfo && parentInfo.type === "button" && isButtonStateLayerName(rawName)) {
        exportButtonStateLayer(layer, parentInfo, indexPath);
        return;
    }

    // A BTN_* layer directly inside a BTN_* group is only a Photoshop marker/art helper.
    // The parent BTN_* group is the real UMG Button, so do not export a nested Button widget.
    if (parentInfo && parentInfo.type === "button" && layerType === "button") {
        return;
    }

    var displayRawName = stripIdenticalSuffixForDisplay(rawName);
    var displaySafeName = sanitizeName(displayRawName);

    var entry = {
        id: "layer_" + layerCounter,
        name: displayRawName,
        safeName: displaySafeName,
        type: layerType,
        groupPath: getGroupPathFromInfo(groupInfoStack),
        groupIdPath: groupIdPath,
        parent: parentInfo ? parentInfo.safeName : "",
        parentId: parentInfo ? parentInfo.id : "",
        parentType: parentInfo ? parentInfo.type : "",
        parentRole: parentRole,
        partRole: partRole,
        rootGroup: rootInfo ? rootInfo.safeName : "",
        rootGroupId: rootInfo ? rootInfo.id : "",
        x: bounds.x,
        y: bounds.y,
        localX: localX,
        localY: localY,
        parentX: parentBounds ? parentBounds.x : 0,
        parentY: parentBounds ? parentBounds.y : 0,
        width: bounds.width,
        height: bounds.height,
        zOrder: (typeof localZOrder === "number") ? localZOrder : zOrderCounter,
        visible: layer.visible === true,
        opacity: Number(layer.opacity) / 100.0,
        // Children of a button group must NOT carry individual rotation.
        // The rotation is recorded on the parent BTN_ group entry (via getButtonGroupRotation)
        // and the UMG importer applies it to UButton.Transform.Angle.
        // For layers outside button groups, read their own PS rotation.
        rotation: (parentInfo && parentInfo.type === "button") ? 0 : getLayerRotationAngle(layer),
        scale: [1.0, 1.0],
        pivot: getPivotForLayer(layerType, rawName),
        anchorPreset: getAnchorPreset(bounds, parentBounds),
        tags: getTagsForLayer(layerType, rawName, groupPathParts, parentRole)
    };

    // GROUPED CHECKBOX MODIFICATION - record parent group info for checkboxes inside CHKG_
    if (layerType === "checkbox" && parentInfo && parentInfo.type === "checkboxGroup") {
        entry.checkboxGroupParentId = parentInfo.id;
        entry.checkboxGroupParentSafeName = parentInfo.safeName;
    }

    layerCounter++;
    zOrderCounter++;

    addChildToParent(parentInfo, displaySafeName, entry.id, "layer", layerType, partRole || (layerType === "spacer" ? "spacer" : ""));

    if (layerType === "checkbox") {
        entry.widgetType = "CheckBox";
        entry.role = "checkbox";
        entry.valueWidget = true;
        entry.valueType = "boolean";
        entry.defaultChecked = false;
        entry.checkboxType = isToggleCheckboxName(rawName) ? "ToggleButton" : "CheckBox";
        entry.style = {
            checkBoxType: entry.checkboxType
        };
        exportedLayers.push(entry);
    } else if (layerType === "border") {
        entry.widgetType = "Border";
        entry.role = "border";
        entry.layoutMode = "border";
        exportedLayers.push(entry);
    } else if (layerType === "gridPanel") {
        entry.widgetType = "GridPanel";
        entry.role = "gridPanel";
        entry.layoutMode = "auto";
        entry.orientation = "grid";
        entry.childPositionMode = "slotOrder";
        entry.gridColumns = getGridPanelColumns(rawName);
        entry.gridRows = getGridPanelRows(rawName);
        entry.childSlot = {
            horizontalAlignment: "Fill",
            verticalAlignment: "Fill",
            padding: [0, 0, 0, 0]
        };
        exportedLayers.push(entry);
    } else if (layerType === "listView") {
        entry.widgetType = "ListView";
        entry.role = "listView";
        entry.layoutMode = "listView";
        entry.orientation = "vertical";
        entry.childPositionMode = "dataView";
        entry.itemHeight = 24;
        exportedLayers.push(entry);
    } else if (layerType === "tileView") {
        entry.widgetType = "TileView";
        entry.role = "tileView";
        entry.layoutMode = "tileView";
        entry.orientation = "tile";
        entry.childPositionMode = "dataView";
        entry.entryWidth = 128;
        entry.entryHeight = 128;
        exportedLayers.push(entry);
    } else if (layerType === "treeView") {
        entry.widgetType = "TreeView";
        entry.role = "treeView";
        entry.layoutMode = "treeView";
        entry.orientation = "tree";
        entry.childPositionMode = "dataView";
        entry.itemHeight = 24;
        exportedLayers.push(entry);
    } else if (layerType === "widgetSwitcher") {
        entry.widgetType = "WidgetSwitcher";
        entry.role = "widgetSwitcher";
        entry.layoutMode = "widgetSwitcher";
        entry.orientation = "stackedPages";
        entry.childPositionMode = "slotOrder";
        entry.activeWidgetIndex = 0;
        entry.childSlot = {
            horizontalAlignment: "Fill",
            verticalAlignment: "Fill",
            padding: [0, 0, 0, 0]
        };
        exportedLayers.push(entry);
    } else if (layerType === "overlay") {
        entry.widgetType = "Overlay";
        entry.role = "overlay";
        entry.layoutMode = "overlay";
        entry.orientation = "overlay";
        entry.childPositionMode = "overlay";
        entry.childSlot = {
            horizontalAlignment: "Fill",
            verticalAlignment: "Fill",
            padding: [0, 0, 0, 0]
        };
        exportedLayers.push(entry);
    } else if (layerType === "safeZone") {
        entry.widgetType = "SafeZone";
        entry.role = "safeZone";
        entry.layoutMode = "safeZone";
        entry.orientation = "singleChild";
        entry.childPositionMode = "singleChild";
        exportedLayers.push(entry);
    } else if (layerType === "scaleBox") {
        entry.widgetType = "ScaleBox";
        entry.role = "scaleBox";
        entry.layoutMode = "scaleBox";
        entry.orientation = "singleChild";
        entry.childPositionMode = "singleChild";
        entry.stretch = "ScaleToFit";
        entry.stretchDirection = "Both";
        exportedLayers.push(entry);
    } else if (layerType === "scrollBox") {
        entry.widgetType = "ScrollBox";
        entry.role = "scrollBox";
        entry.layoutMode = "auto";
        entry.orientation = getScrollBoxOrientation(rawName);
        entry.scrollOrientation = entry.orientation;
        entry.customSize = isScrollBoxCustomSizeName(rawName);
        entry.customScrollBoxSize = entry.customSize;
        entry.viewportSizeFromBounds = entry.customSize;
        entry.childPositionMode = "slotOrder";
        entry.expectedParts = ["scrollBoxBar", "scrollBoxThumb"];
        entry.style = {
            barImagePart: "scrollBoxBar",
            thumbImagePart: "scrollBoxThumb"
        };
        if (entry.customSize) {
            entry.sizeIndicatorOnly = true;
            entry.scrollBoxSizeIndicator = true;
            entry.customScrollBoxWidth = bounds.width;
            entry.customScrollBoxHeight = bounds.height;
            applyScrollBoxSizeIndicatorToParent(parentInfo, entry, bounds);
        }
        exportedLayers.push(entry);
    } else if (layerType === "sizeBox") {
        entry.widgetType = "SizeBox";
        entry.role = "sizeBox";
        entry.layoutMode = "sizeBox";
        entry.orientation = "singleChild";
        entry.childPositionMode = "singleChild";
        entry.overrideWidth = bounds.width;
        entry.overrideHeight = bounds.height;
        exportedLayers.push(entry);
    } else if (layerType === "stackBox") {
        entry.widgetType = "StackBox";
        entry.role = "stackBox";
        entry.layoutMode = "auto";
        entry.orientation = getStackBoxOrientation(rawName);
        entry.stackOrientation = entry.orientation;
        entry.childPositionMode = "slotOrder";
        exportedLayers.push(entry);
    } else if (layerType === "spacer") {
        entry.widgetType = "Spacer";
        entry.layoutMode = "spacer";
        var spacerSize = getSpacerSize(rawName);
        entry.spacingX = spacerSize[0];
        entry.spacingY = spacerSize[1];
        entry.spacingValue = Math.max(entry.spacingX, entry.spacingY);
        entry.spacerSize = spacerSize;
        exportedLayers.push(entry);
    } else if (layerType === "image" || layerType === "button") {
        entry.drawType = getDrawTypeForPartRole(partRole, rawName, layerType);
        entry.margin = getMarginForPartRole(partRole, rawName, layerType);

        if (layerType === "button") {
            entry.interaction = {
                event: getInteractionName(rawName)
            };
        }

        if (partRole === "radialSliderSizeReference") {
            // BAR_ under a RadialSlider only transfers position and size to the parent.
            // It is not exported as a visual brush/background.
            entry.sizeIndicatorOnly = true;
            entry.exportVisual = false;
            applyRadialSliderPositionSizeToParent(parentInfo, entry, bounds);
            exportedLayers.push(entry);
        } else if (layerType === "button") {
            // BTN_* single layer is a transform placeholder only.
            // Never export a PNG for flat BTN_* layers.
            entry.widgetType = "Button";
            entry.exportVisual = false;
            exportedLayers.push(entry);
            
        } else {
            // ── Solid-color optimisation (enabled via Export Options checkbox) ──
            // When solidColorOpt is true and the layer is a flat uniform color,
            // export a tiny SOLID_COLOR_EXPORT_SIZE×SOLID_COLOR_EXPORT_SIZE PNG
            // instead of the full-size one. Real layout bounds are unchanged.
            try {
                var layerIsSolid = solidColorOpt && isLayerSolidColor(layer);
                if (layerIsSolid) {
                    var colorInfo = getSolidColorInfo(layer);

                    // Build the output path (strip IDN suffix, avoid duplicates).
                    var solidTexName  = sanitizeName(stripIdenticalSuffixForDisplay(baseSafeName));
                    var solidFsPath   = texFolder.fsName + "/" + solidTexName + ".png";
                    var solidAsset    = "Textures/" + solidTexName + ".png";

                    var solidGroupKey = tryResolveIdenticalTextureGroup(sanitizeName(baseSafeName));
                    if (solidGroupKey && identicalTextureGroups[solidGroupKey]) {
                        entry.asset = identicalTextureGroups[solidGroupKey];
                    } else {
                        var solidExisting = new File(solidFsPath);
                        if (!(skipExisting && solidExisting.exists)) {
                            _exportCount++;
                            updateProgress(_exportCount, _exportTotal,
                                solidTexName + " [solid " + SOLID_COLOR_EXPORT_SIZE + "x" + SOLID_COLOR_EXPORT_SIZE + "]");
                            exportSolidColorLayerPng(doc, indexPath, solidFsPath);
                        }
                        if (solidGroupKey) identicalTextureGroups[solidGroupKey] = solidAsset;
                        entry.asset = solidAsset;
                    }

                    entry.isSolidColor      = true;
                    entry.solidColor        = colorInfo.rgb;
                    entry.solidColorRGBA    = colorInfo.rgba;
                    entry.layerOpacity      = colorInfo.layerOpacity;
                    entry.fillOpacity       = colorInfo.fillOpacity;
                    entry.effectiveAlpha    = colorInfo.effectiveAlpha;
                    entry.exportedSize      = [SOLID_COLOR_EXPORT_SIZE, SOLID_COLOR_EXPORT_SIZE];
                    entry.exportNote        = "Solid color layer exported at " +
                                              SOLID_COLOR_EXPORT_SIZE + "x" + SOLID_COLOR_EXPORT_SIZE +
                                              "px. Stretch to fit in Unreal. Alpha baked into PNG.";
                    exportedLayers.push(entry);
                } else {
                    entry.asset = exportSingleLayerPngOnceByName(doc, indexPath, baseSafeName);
                    exportedLayers.push(entry);
                }
            } catch (imgErr) {
                warnings.push("Failed to export image layer " + rawName + ": " + imgErr.message);
            }
        }
    } else if (layerType === "text" || layerType === "textInput" || layerType === "textInputMultiLine" || layerType === "editableTextBox" || layerType === "editableTextBoxMultiLine" || layerType === "comboOption") {
        if (layer.kind !== LayerKind.TEXT) {
            warnings.push("Layer skipped because it uses a text/input prefix but is not a real text layer: " + rawName);
            return;
        }

        if (layerType === "textInput" || layerType === "textInputMultiLine" || layerType === "editableTextBox" || layerType === "editableTextBoxMultiLine") {
            entry.inputWidget = true;
            entry.valueWidget = true;
            entry.valueType = "text";
            entry.isMultiLine = (layerType === "textInputMultiLine" || layerType === "editableTextBoxMultiLine");
            entry.hasBoxChrome = (layerType === "editableTextBox" || layerType === "editableTextBoxMultiLine");
            entry.widgetType = layerType === "textInput" ? "EditableText" :
                layerType === "textInputMultiLine" ? "MultiLineEditableText" :
                layerType === "editableTextBox" ? "EditableTextBox" : "MultiLineEditableTextBox";
            entry.defaultText = "";
            entry.placeholder = "";
        }

        // Photoshop stores paragraph breaks as \r (carriage return, 0x0D).
        // JSON encodes them as the two-character sequence \r which Unreal Engine
        // does NOT expand into real newlines inside FText / RichTextBlock widgets.
        // We normalise \r\n and bare \r to \n so the JSON contains real line-feed
        // characters (0x0A). escapeJsonString then writes them as \n escape sequences
        // which Unreal's JSON parser correctly converts back to real newlines.
        entry.text = layer.textItem.contents;
        entry.text = entry.text.replace(/\r\n/g, "\n").replace(/\r/g, "\n");
        if (entry.inputWidget) {
            entry.placeholder = entry.text;
            entry.defaultText = "";
        }
        entry.direction = getTextDirection(entry.text);
        entry.fontAsset = getRecommendedFontAssetForText(entry.text);

// Export ORIGINAL Photoshop font size.
// Unreal importer now uses GlobalTextFontScale = 1.0,
// so we do not bake Free Transform scaling into fontSize.

var transformScaleY = 1.0;
try {
    var tf = layer.textItem.transform;
    var scaleY = Math.sqrt(tf[3] * tf[3] + tf[2] * tf[2]);
    if (scaleY > 0.001) {
        transformScaleY = scaleY;
    }
} catch (tfErr) {
    transformScaleY = 1.0;
}

try
{
    var sizePt = getCharacterPanelFontSize(layer);

    if (sizePt === null || sizePt <= 0)
    {
        sizePt = Number(layer.textItem.size.as("pt"));
    }

    // Debug
    entry.debugImpliedSize = sizePt;
    entry.debugDomSize = Number(layer.textItem.size.as("pt"));
    entry.debugTransform = transformScaleY;

    entry.baseFontSize = sizePt;
    entry.transformScaleY = transformScaleY;
    entry.fontSize = sizePt;
    entry.visualFontSize = sizePt;
}
catch (fontErr)
{
    entry.baseFontSize = 24;
    entry.transformScaleY = 1.0;
    entry.fontSize = 24;
    entry.visualFontSize = 24;

    entry.fontError = String(fontErr);
}

        // Export the typographic line height in points, scaled by the same transform.
        // textItem.bounds is font-metric-based (full ascender→descender span for the font
        // face at the original type size). Multiplying by transformScaleY gives the visual
        // typographic height, which is character-independent — unlike layer.bounds.height
        // which grows when the text contains descenders (g, j, p, q, y) and shrinks for
        // all-caps strings. The importer uses fontLineHeight to normalise between layers
        // that carry the same visual size but different rendered pixel heights.
        // Fallback: use fontSize so the importer always has a valid value.
try {
    var tBounds = layer.textItem.bounds;

    var tLineHeightPt =
        Math.abs(
            Number(tBounds[2].as("pt")) -
            Number(tBounds[0].as("pt"))
        );

    entry.fontLineHeight =
        (tLineHeightPt > 0)
            ? tLineHeightPt
            : entry.fontSize;
}
catch (lhErr) {
    entry.fontLineHeight = entry.fontSize;
}

        try {
            entry.fontFamily = String(layer.textItem.font);
        } catch (fontNameErr) {
            entry.fontFamily = "";
        }

        try {
            entry.color = colorToHex(layer.textItem.color);
        } catch (colorErr) {
            entry.color = "#FFFFFF";
        }

        try {
            entry.alignment = normalizeJustification(layer.textItem.justification);
            entry.justification = entry.alignment;
        } catch (alignErr) {
            entry.alignment = "Left";
            entry.justification = "Left";
        }

        if (entry.direction === "RTL") {
            entry.alignment = "Right";
            entry.justification = "Right";
        }

        entry.fontWeight = startsWith(rawName, "TXT_Title") || startsWith(rawName, "TXT_HEADER") ? "Bold" : "Regular";

        // ── Italic / Faux Italic ───────────────────────────────────────────────
        // "Italic" here means the layer is using a true italic font face (e.g.
        // "MyFont-Italic"). Photoshop exposes this via the postscript font name
        // which typically contains "Italic" or "Oblique" as a substring.
        //
        // "Faux Italic" is Photoshop's synthetic slant applied on top of a regular
        // (non-italic) font face — stored as syntheticItalic=true in the textStyle
        // ActionDescriptor. We export both flags independently so the importer can
        // choose the right UMG approach: a proper italic typeface when available, or
        // FSlateFontInfo skew override for faux italic.
        try {
            var psFont = String(layer.textItem.font || "");
            entry.isItalic = /italic|oblique/i.test(psFont);
        } catch (italicFontErr) {
            entry.isItalic = false;
        }

        // Faux italic: read syntheticItalic from the first textStyleRange descriptor.
        entry.isFauxItalic = false;
        try {
            var fiRef = new ActionReference();
            fiRef.putIdentifier(charIDToTypeID("Lyr "), layer.id);
            var fiLayerDesc = executeActionGet(fiRef);
            var fiTextKey = fiLayerDesc.getObjectValue(stringIDToTypeID("textKey"));
            var fiStyleRanges = fiTextKey.getList(stringIDToTypeID("textStyleRange"));
            if (fiStyleRanges.count > 0) {
                var fiTextStyle = fiStyleRanges.getObjectValue(0)
                    .getObjectValue(stringIDToTypeID("textStyle"));
                if (fiTextStyle.hasKey(stringIDToTypeID("syntheticItalic"))) {
                    entry.isFauxItalic = fiTextStyle.getBoolean(stringIDToTypeID("syntheticItalic"));
                }
            }
        } catch (fauxItalicErr) {
            entry.isFauxItalic = false;
        }

        // ── All Caps / Small Caps ──────────────────────────────────────────────
        // Photoshop stores capitalization on textItem.capitalization as a
        // TextCase enum: NORMAL, ALLCAPS, SMALLCAPS, SUBSCRIPT, SUPERSCRIPT.
        // We export allCaps=true so the importer can call TextValue.ToUpper()
        // and set the TextBlock text correctly (UMG has no runtime caps toggle).
        try {
            var psCapitalization = layer.textItem.capitalization;
            entry.allCaps   = (psCapitalization === TextCase.ALLCAPS);
            entry.smallCaps = (psCapitalization === TextCase.SMALLCAPS);
            entry.capitalization = String(psCapitalization);
        } catch (capsErr) {
            // Fallback: try ActionDescriptor path for capitalization
            try {
                var capsRef = new ActionReference();
                capsRef.putIdentifier(charIDToTypeID("Lyr "), layer.id);
                var capsDesc = executeActionGet(capsRef);
                var capsTextKey = capsDesc.getObjectValue(stringIDToTypeID("textKey"));
                var capsStyleRanges = capsTextKey.getList(stringIDToTypeID("textStyleRange"));
                if (capsStyleRanges.count > 0) {
                    var capsStyle = capsStyleRanges.getObjectValue(0)
                        .getObjectValue(stringIDToTypeID("textStyle"));
                    var capsValue = capsStyle.hasKey(stringIDToTypeID("capitalization"))
                        ? capsStyle.getEnumerationValue(stringIDToTypeID("capitalization"))
                        : 0;
                    // Photoshop caps enum: 0=normal, 1=allCaps, 2=smallCaps
                    entry.allCaps   = (capsValue === 1);
                    entry.smallCaps = (capsValue === 2);
                    entry.capitalization = capsValue === 1 ? "ALLCAPS" : capsValue === 2 ? "SMALLCAPS" : "NORMAL";
                }
            } catch (capsErr2) {
                entry.allCaps   = false;
                entry.smallCaps = false;
                entry.capitalization = "NORMAL";
            }
        }

        // ── Tracking (VA) ─────────────────────────────────────────────────────
        // Photoshop tracking is stored in 1/1000 em units on textItem.tracking.
        // Unreal's FontInfo.LetterSpacing uses the same 1/1000 em unit, so we
        // can pass the value directly without any conversion.
        // Fallback to 0 if the property is unavailable.
        try {
            entry.letterSpacing = Number(layer.textItem.tracking) || 0;
        } catch (trackErr) {
            entry.letterSpacing = 0;
        }

        // ── Leading (line spacing) ─────────────────────────────────────────────
        // Photoshop leading is the distance from one baseline to the next, in
        // points.  textItem.leading returns the numeric value when leading is set
        // manually; autoLeading returns true when Photoshop is managing it.
        // We export:
        //   leading        – the raw pt value (or 0 when auto)
        //   autoLeading    – true / false
        //   lineHeightPct  – leading expressed as a percentage of fontSize,
        //                    which maps directly to Unreal's LineHeightPercentage.
        //                    e.g. 50 pt leading at 32 pt font → 156 %
        try {
            var psAutoLeading = layer.textItem.useAutoLeading;
            entry.autoLeading = (psAutoLeading === true);
            if (entry.autoLeading) {
                // Auto-leading: Photoshop manages spacing internally via font metrics.
                // Export lineHeightPct=1.0 so the importer skips SetLineHeightPercentage
                // and lets Unreal use its own natural font line height — which visually
                // matches Photoshop auto-leading without forcing any override.
                entry.leading = 0;
                entry.lineHeightPct = 1.0;
            } else {
                // Manual leading: read via ActionDescriptor so we always get POINTS,
                // regardless of the document's current ruler unit setting.
                // textItem.leading returns a raw number in ruler units which can be
                // pixels at 96/144 dpi — that causes the ratio to be too large.
                var psLeadingPt = entry.fontSize; // safe fallback
                try {
                    var leadRef = new ActionReference();
                    leadRef.putIdentifier(charIDToTypeID("Lyr "), layer.id);
                    var leadDesc = executeActionGet(leadRef);
                    var leadTextKey = leadDesc.getObjectValue(stringIDToTypeID("textKey"));
                    var leadParaRanges = leadTextKey.getList(stringIDToTypeID("paragraphStyleRange"));
                    if (leadParaRanges.count > 0) {
                        var leadParaStyle = leadParaRanges.getObjectValue(0)
                            .getObjectValue(stringIDToTypeID("paragraphStyle"));
                        // "leading" in the paragraph style is stored in pt internally
                        if (leadParaStyle.hasKey(stringIDToTypeID("leading"))) {
                            psLeadingPt = leadParaStyle.getUnitDoubleValue(stringIDToTypeID("leading"));
                        }
                    }
                } catch (leadPtErr) {
                    // Fallback: ruler-unit value — still better than nothing
                    psLeadingPt = Number(layer.textItem.leading) || entry.fontSize;
                }
                entry.leading = psLeadingPt;
                entry.lineHeightPct = (entry.fontSize > 0)
                    ? Math.round((psLeadingPt / entry.fontSize) * 1000) / 1000
                    : 1.0;
            }
        } catch (leadErr) {
            entry.autoLeading = true;
            entry.leading = 0;
            entry.lineHeightPct = 1.0;
        }

        // ── Drop Shadow ───────────────────────────────────────────────────────
        // Photoshop drop shadows live on layer.layerEffects.dropShadow (DOM),
        // but the most reliable source for all properties (including enabled state,
        // opacity, angle, distance, spread, size, and choke) is the ActionDescriptor
        // under layerEffects > dropShadow. We read from the ActionDescriptor first
        // and fall back to the DOM layerEffects object when the descriptor path fails.
        //
        // Photoshop drop shadow anatomy → Unreal mapping:
        //   angle + distance (px)  →  offset [x, y] in canvas pixels
        //   color (RGB)            →  shadow.color as #RRGGBBAA
        //   opacity (0-100 %)      →  baked into color alpha channel
        //   enabled                →  shadow only exported when true
        //
        // UMG TextBlock supports SetShadowOffset(FVector2D) and
        // SetShadowColorAndOpacity(FLinearColor) where alpha = opacity.
        // We export:
        //   shadow.offset   – [x, y] pixel offset in canvas space
        //   shadow.color    – "#RRGGBBAA" with opacity in the alpha byte
        //   shadow.opacity  – 0.0-1.0 float (redundant but handy for the importer)
        //   shadow.enabled  – true/false so the importer can skip zero-opacity shadows
        (function exportDropShadow() {
            // Default: no shadow
            entry.shadow = { offset: [0, 0], color: "#00000000", opacity: 0.0, enabled: false };

            try {
                // ── Path 1: ActionDescriptor (most reliable) ──────────────────
                var dsRef = new ActionReference();
                dsRef.putIdentifier(charIDToTypeID("Lyr "), layer.id);
                var dsLayerDesc = executeActionGet(dsRef);

                if (!dsLayerDesc.hasKey(stringIDToTypeID("layerEffects"))) return;
                var dsEffects = dsLayerDesc.getObjectValue(stringIDToTypeID("layerEffects"));

                // Photoshop uses "dropShadow" (single) in the layerEffects descriptor.
                if (!dsEffects.hasKey(stringIDToTypeID("dropShadow"))) return;
                var dsEffect = dsEffects.getObjectValue(stringIDToTypeID("dropShadow"));

                // enabled flag – skip if the effect exists but is turned off
                var dsEnabled = true;
                if (dsEffect.hasKey(stringIDToTypeID("enabled"))) {
                    dsEnabled = dsEffect.getBoolean(stringIDToTypeID("enabled"));
                }
                if (!dsEnabled) return;

                // ── Opacity (0–100 in PS, normalise to 0.0–1.0) ──────────────
                var dsOpacity = 75; // Photoshop default
                if (dsEffect.hasKey(stringIDToTypeID("opacity"))) {
                    dsOpacity = dsEffect.getUnitDoubleValue(stringIDToTypeID("opacity"));
                }
                var dsOpacityNorm = Math.max(0.0, Math.min(1.0, dsOpacity / 100.0));

                // ── Color ─────────────────────────────────────────────────────
                var dsR = 0, dsG = 0, dsB = 0;
                if (dsEffect.hasKey(stringIDToTypeID("color"))) {
                    var dsColorDesc = dsEffect.getObjectValue(stringIDToTypeID("color"));
                    if (dsColorDesc.hasKey(stringIDToTypeID("red")))   dsR = Math.round(dsColorDesc.getUnitDoubleValue(stringIDToTypeID("red")));
                    if (dsColorDesc.hasKey(stringIDToTypeID("grain"))) dsG = Math.round(dsColorDesc.getUnitDoubleValue(stringIDToTypeID("grain")));
                    if (dsColorDesc.hasKey(stringIDToTypeID("blue")))  dsB = Math.round(dsColorDesc.getUnitDoubleValue(stringIDToTypeID("blue")));
                }
                var dsA = Math.round(dsOpacityNorm * 255);

                function byteToHex(b) {
                    var h = Math.max(0, Math.min(255, Math.round(b))).toString(16);
                    return h.length === 1 ? "0" + h : h;
                }
                var dsColorHex = "#" + byteToHex(dsR) + byteToHex(dsG) + byteToHex(dsB) + byteToHex(dsA);

                // ── Angle + Distance → X/Y offset ────────────────────────────
                // Photoshop stores the shadow direction as the light-source angle
                // (where 120° = light from upper-left → shadow falls lower-right).
                // useGlobalLight=true means the document-level light angle applies.
                //
                // Canvas Y-axis is inverted (positive = down), so:
                //   offsetX =  distance * cos(angle_rad)
                //   offsetY = -distance * sin(angle_rad)   ← flip for screen space
                var dsAngleDeg  = 120; // PS default light angle
                var dsDistance  = 5;   // px
                var dsUseGlobal = true;

                if (dsEffect.hasKey(stringIDToTypeID("useGlobalAngle"))) {
                    dsUseGlobal = dsEffect.getBoolean(stringIDToTypeID("useGlobalAngle"));
                }
                if (dsUseGlobal) {
                    // Read global light angle from document info
                    try {
                        var globalDesc = executeActionGet(new ActionReference());
                        // global light angle lives on the document descriptor
                        var docRef2 = new ActionReference();
                        docRef2.putEnumerated(charIDToTypeID("capp"), charIDToTypeID("Ordn"), charIDToTypeID("Trgt"));
                        var docDesc2 = executeActionGet(docRef2);
                        if (docDesc2.hasKey(stringIDToTypeID("globalAngle"))) {
                            dsAngleDeg = docDesc2.getUnitDoubleValue(stringIDToTypeID("globalAngle"));
                        }
                    } catch (globalAngleErr) { /* keep default */ }
                } else if (dsEffect.hasKey(stringIDToTypeID("localLightingAngle"))) {
                    dsAngleDeg = dsEffect.getUnitDoubleValue(stringIDToTypeID("localLightingAngle"));
                } else if (dsEffect.hasKey(stringIDToTypeID("angle"))) {
                    dsAngleDeg = dsEffect.getUnitDoubleValue(stringIDToTypeID("angle"));
                }

                if (dsEffect.hasKey(stringIDToTypeID("distance"))) {
                    dsDistance = dsEffect.getUnitDoubleValue(stringIDToTypeID("distance"));
                }

                var dsAngleRad = dsAngleDeg * Math.PI / 180.0;
                // Negate both axes to flip the shadow to the opposite direction.
                var dsOffsetX  = Math.round(-dsDistance * Math.cos(dsAngleRad) * 100) / 100;
                var dsOffsetY  = Math.round( dsDistance * Math.sin(dsAngleRad) * 100) / 100;

                entry.shadow = {
                    offset:  [dsOffsetX, dsOffsetY],
                    color:   dsColorHex,
                    opacity: dsOpacityNorm,
                    enabled: true
                };

            } catch (shadowErr) {
                // ── Path 2: DOM fallback (layerEffects property) ──────────────
                // Less reliable but available in older PS versions.
                try {
                    var domFX = layer.layerEffects;
                    if (domFX && domFX.dropShadow && domFX.dropShadow.enabled) {
                        var domDS    = domFX.dropShadow;
                        var domOpN   = Math.max(0.0, Math.min(1.0, (Number(domDS.opacity) || 75) / 100.0));
                        var domColor = domDS.color;
                        var domR = Math.round(domColor.rgb.red);
                        var domG = Math.round(domColor.rgb.green);
                        var domB = Math.round(domColor.rgb.blue);
                        var domA = Math.round(domOpN * 255);

                        function byteToHex2(b) {
                            var h = Math.max(0, Math.min(255, Math.round(b))).toString(16);
                            return h.length === 1 ? "0" + h : h;
                        }

                        var domAngleRad = ((Number(domDS.angle) || 120)) * Math.PI / 180.0;
                        var domDist     = Number(domDS.distance) || 5;
                        // Negate both axes to flip the shadow to the opposite direction.
                        var domOX       = Math.round(-domDist * Math.cos(domAngleRad) * 100) / 100;
                        var domOY       = Math.round( domDist * Math.sin(domAngleRad) * 100) / 100;

                        entry.shadow = {
                            offset:  [domOX, domOY],
                            color:   "#" + byteToHex2(domR) + byteToHex2(domG) + byteToHex2(domB) + byteToHex2(domA),
                            opacity: domOpN,
                            enabled: true
                        };
                    }
                } catch (domShadowErr) { /* leave default no-shadow */ }
            }
        })();

        // ── Wrap width ────────────────────────────────────────────────────────
        // Photoshop area-type text boxes have a fixed width that determines where
        // lines wrap. We export that width explicitly so the Unreal importer can
        // set TextBlock.WrapTextAt to the same value, reproducing the exact same
        // line breaks seen in Photoshop.
        // autoWrapText = true  →  importer sets bAutoWrapText = true
        // wrapTextAt          →  importer sets WrapTextAt = bounds.width  (px)
        //
        // Point-type (single-line) layers have a bounds width that equals the
        // rendered text width, not a user-set box — wrapping them would break
        // single-line labels. We detect area-type layers by checking whether
        // Photoshop's textItem has a bounding box wider/taller than the rendered
        // text naturally would be, i.e. when the layer height > 1 line of text.
        // A safe heuristic: if the layer height > fontSize * 2, it is area text.
        var isAreaText = false;
        try {
            // Photoshop exposes textItem.kind: TextType.AREATEXT vs POINTTEXT.
            // Some Photoshop/ExtendScript versions do not report this reliably,
            // so do not rely on it alone.
            isAreaText = (layer.textItem.kind === TextType.AREATEXT);
        } catch (areaErr) {
            isAreaText = false;
        }

        var textHasExplicitLineBreak = false;
        try {
            textHasExplicitLineBreak = (String(text || "").indexOf("\r") >= 0 || String(text || "").indexOf("\n") >= 0);
        } catch (lineBreakErr) {
            textHasExplicitLineBreak = false;
        }

        // Fallback heuristic: Photoshop wrapped paragraph text often exports with
        // a box height that is clearly taller than one line, even when textItem.kind
        // reports as point text. Detect that and preserve the PSD box width.
        var effectiveLineHeight = Number(entry.fontLineHeight || entry.leading || entry.fontSize || 0);
        if (!effectiveLineHeight || effectiveLineHeight <= 0) {
            effectiveLineHeight = Number(entry.fontSize || 24);
        }
        var looksLikeWrappedTextBox = (bounds.width > 0 && bounds.height > (effectiveLineHeight * 1.25));

        if (isAreaText || textHasExplicitLineBreak || looksLikeWrappedTextBox) {
            entry.autoWrapText = true;
            entry.wrapTextAt = bounds.width;
        } else {
            entry.autoWrapText = false;
            entry.wrapTextAt = 0;
        }

        exportedLayers.push(entry);
    }
}

function exportButtonStateLayer(stateLayer, parentButtonInfo, indexPath) {
    if (!parentButtonInfo || parentButtonInfo.type !== "button" || !parentButtonInfo.entry) {
		
        warnings.push("Button state layer ignored because it is not directly inside a BTN_ group: " + stateLayer.name);
        return;
    }

    var stateName = getButtonStateName(stateLayer.name);
    if (!stateName) {
        warnings.push("Button state layer ignored because the state name is not supported: " + stateLayer.name);
        return;
    }

    var texName = makeButtonStateTextureName(parentButtonInfo, stateName, stateLayer.name);
    var bounds = getBounds(stateLayer);

// TEMP DEBUG
parentButtonInfo.entry.debugStates = parentButtonInfo.entry.debugStates || [];

parentButtonInfo.entry.debugStates.push({
    stateName: stateLayer.name,
    x: bounds.x,
    y: bounds.y,
    width: bounds.width,
    height: bounds.height
});

    if (!parentButtonInfo.entry.buttonStates) {
        parentButtonInfo.entry.buttonStates = {};
    }

    try {
        var assetPath = exportSingleLayerPngOnceByName(doc, indexPath, texName);

        parentButtonInfo.entry.buttonStates[stateName] = {
            name: stripIdenticalSuffixForDisplay(stateLayer.name),
            state: stateName,
            asset: assetPath,
            x: bounds.x,
            y: bounds.y,
            width: bounds.width,
            height: bounds.height,
            // States are axis-aligned style brushes. The visual tilt belongs on
            // the parent BTN_ group entry (rotation field) only, never here.
            rotation: 0,
            drawType: "Image",
            margin: [0.0, 0.0, 0.0, 0.0]
        };

        if (!parentButtonInfo.entry.tags) {
            parentButtonInfo.entry.tags = [];
        }
        parentButtonInfo.entry.tags.push("ButtonStates");
    } catch (stateErr) {
        warnings.push("Failed to export button state layer " + stateLayer.name + " for " + parentButtonInfo.name + ": " + stateErr.message);
    }
}

function exportButtonStateGroup(stateGroupLayer, parentButtonInfo, indexPath) {
    if (!parentButtonInfo || parentButtonInfo.type !== "button" || !parentButtonInfo.entry) {
        warnings.push("STATE_ group ignored because it is not directly inside a BTN_ group: " + stateGroupLayer.name);
        return;
    }

    var stateName = getButtonStateName(stateGroupLayer.name);
    if (!stateName) {
        warnings.push("STATE_ group ignored because the state name is not supported: " + stateGroupLayer.name);
        return;
    }
    var texName = makeButtonStateTextureName(parentButtonInfo, stateName, stateGroupLayer.name);
    var assetPath = "Textures/" + texName + ".png";
    var bounds = getBounds(stateGroupLayer);

    if (!parentButtonInfo.entry.buttonStates) {
        parentButtonInfo.entry.buttonStates = {};
    }

    try {
        exportGroupPng(doc, indexPath, texFolder.fsName + "/" + texName + ".png");

        parentButtonInfo.entry.buttonStates[stateName] = {
            name: stateGroupLayer.name,
            state: stateName,
            asset: assetPath,
            x: bounds.x,
            y: bounds.y,
            width: bounds.width,
            height: bounds.height,
            // States are axis-aligned style brushes. The visual tilt belongs on
            // the parent BTN_ group entry (rotation field) only, never here.
            rotation: 0,
            drawType: "Image",
            margin: [0.0, 0.0, 0.0, 0.0]
        };

        if (!parentButtonInfo.entry.tags) {
            parentButtonInfo.entry.tags = [];
        }
        parentButtonInfo.entry.tags.push("ButtonStates");
    } catch (stateErr) {
        warnings.push("Failed to export button state " + stateGroupLayer.name + " for " + parentButtonInfo.name + ": " + stateErr.message);
    }
}

// Count the visible, exportable siblings in a container so walkLayers can
// invert the zOrder index.  Button-state groups are consumed internally and
// never become UMG widgets, so they are excluded from the count.
function countVisibleSiblings(container) {
    var count = 0;
    for (var i = 0; i < container.layers.length; i++) {
        var layer = container.layers[i];
        if (!layer.visible) { continue; }
        if (layer.typename === "LayerSet" && isButtonStateGroupName(layer.name)) { continue; }
        count++;
    }
    return count;
}

function walkLayers(container, groupInfoStack, indexPathPrefix) {
    // Photoshop layers[0] is the TOPMOST layer (drawn over everything else).
    //
    // Canvas panels: higher ZOrder = rendered on top.
    //   → iterate forward (0→N), invert the zOrder value so layers[0] gets the highest.
    //
    // HorizontalBox / VerticalBox: slot order = children[] array order (left→right / top→bottom).
    //   In Photoshop the leftmost/topmost item sits at the BOTTOM of the layer stack (highest index).
    //   → iterate in reverse (N→0) so layers[N] (PS bottommost = HBox leftmost) is pushed first.
    //   ZOrder is irrelevant for box slots, so we keep the same inversion formula for consistency.

    var parentInfo = getParentGroupInfo(groupInfoStack);
    var parentType = parentInfo ? (parentInfo.type || parentInfo.role || "") : "";
    var isLayoutBox = (parentType === "horizontalBox" || parentType === "verticalBox" || parentType === "uniformGridPanel");

    var siblingCount = countVisibleSiblings(container);
    var visibleIndex = 0;

    var start = isLayoutBox ? container.layers.length - 1 : 0;
    var end   = isLayoutBox ? -1                          : container.layers.length;
    var step  = isLayoutBox ? -1                          : 1;

    for (var i = start; i !== end; i += step) {
        var layer = container.layers[i];
        var indexPath = indexPathPrefix.concat([i]);

        if (!layer) { continue; } // guard against undefined slot (corrupted PSD)

        if (!layer.visible) {
            continue;
        }

        if (layer.typename === "LayerSet") {
            if (isButtonStateGroupName(layer.name)) {
                exportButtonStateGroup(layer, parentInfo, indexPath);
                continue;
            }

            var localZOrder = siblingCount - 1 - visibleIndex;
            var groupInfo = addGroupEntry(layer, groupInfoStack, localZOrder);
            var nextGroupStack = groupInfoStack.concat([groupInfo]);
            walkLayers(layer, nextGroupStack, indexPath);
        } else if (layer.typename === "ArtLayer") {
            var localZOrder = siblingCount - 1 - visibleIndex;
            addLayerEntry(layer, groupInfoStack, indexPath, localZOrder);
        }

        visibleIndex++;
    }
}

// ── Count exportable image layers for the progress bar ───────────────────────
function countImageLayers(container) {
    var count = 0;
    for (var i = 0; i < container.layers.length; i++) {
        var layer = container.layers[i];
        if (!layer.visible) continue;
        if (layer.typename === "LayerSet") {
            if (!isButtonStateGroupName(layer.name)) {
                count += countImageLayers(layer);
            } else {
                count++; // button state group exports one PNG
            }
        } else if (layer.typename === "ArtLayer") {
            var lt = getLayerType(layer);
            if (lt === "image") count++;
        }
    }
    return count;
}


// ── Slider default-value resolver ────────────────────────────────────────────
// After all layers are walked, compute each SLD_ group's defaultValue from
// the actual pixel positions of the BAR_ (track) and THM_ (thumb) children.
//
// Geometry:
//   Horizontal slider:
//     value = clamp((thumbCenterX - barLeft) / barWidth, 0, 1)
//   Vertical slider:
//     value = clamp((thumbCenterY - barTop)  / barHeight, 0, 1)
//
// All positions are in document-space (absolute pixels), so they subtract
// directly regardless of nesting depth.
//
// Falls back to 0.5 when geometry data is missing or the track has zero size.
function resolveSliderDefaultValues() {
    // Build a flat lookup: id -> entry, covering both groups and layers.
    var entryById = {};
    var i;
    for (i = 0; i < exportedGroups.length; i++) {
        entryById[exportedGroups[i].id] = exportedGroups[i];
    }
    for (i = 0; i < exportedLayers.length; i++) {
        entryById[exportedLayers[i].id] = exportedLayers[i];
    }

    for (i = 0; i < exportedGroups.length; i++) {
        var group = exportedGroups[i];
        if (group.type !== "slider") {
            continue;
        }

        var isHorizontal = (group.orientation === "horizontal");

        // Find the BAR_ (track) and THM_ (thumb) children by partRole.
        var barEntry   = null;
        var thumbEntry = null;
        var children   = group.children || [];
        for (var c = 0; c < children.length; c++) {
            var child = entryById[children[c].id];
            if (!child) continue;
            var role = children[c].role || child.partRole || "";
            if (!barEntry && (role === "sliderBar" || role === "sliderFillBar")) {
                barEntry = child;
            }
            if (!thumbEntry && role === "sliderThumb") {
                thumbEntry = child;
            }
        }

        if (!barEntry || !thumbEntry) {
            // No geometry to work with — leave the default as-is.
            continue;
        }

        // All positions in the exported JSON are document-space absolute pixels.
        var computed = 0.5;
        if (isHorizontal) {
            var trackWidth = barEntry.width || 0;
            if (trackWidth > 0) {
                var thumbCenterX = thumbEntry.x + (thumbEntry.width  || 0) * 0.5;
                var trackLeft    = barEntry.x;
                computed = (thumbCenterX - trackLeft) / trackWidth;
            }
        } else {
            var trackHeight = barEntry.height || 0;
            if (trackHeight > 0) {
                var thumbCenterY = thumbEntry.y + (thumbEntry.height || 0) * 0.5;
                var trackTop     = barEntry.y;
                computed = (thumbCenterY - trackTop) / trackHeight;
            }
        }

        // Clamp to [0, 1] in case the thumb was dragged slightly outside the track.
        if (computed < 0) computed = 0;
        if (computed > 1) computed = 1;

        // Round to 4 decimal places to keep the JSON tidy.
        computed = Math.round(computed * 10000) / 10000;

        group.defaultValue = computed;
    }
}

// ── Auto-layout child slot sizing ────────────────────────────────────────────
// For HorizontalBox and VerticalBox containers, each child needs a per-child
// sizeRule + fillRatio that reflects the proportional width/height it occupies
// in the PSD. Without this, UMG defaults every child to sizeRule=Auto which
// collapses zero-size or empty sibling panels and breaks proportional layouts.
//
// For ScrollBox containers, children stack vertically; we write localY as
// top-padding on each child's slot so the importer can preserve spacing.
function applyAutoLayoutChildSlots() {
    var objectById = {};
    var i;
    for (i = 0; i < exportedGroups.length; i++) {
        objectById[exportedGroups[i].id] = exportedGroups[i];
    }
    for (i = 0; i < exportedLayers.length; i++) {
        objectById[exportedLayers[i].id] = exportedLayers[i];
    }

    for (var g = 0; g < exportedGroups.length; g++) {
        var container = exportedGroups[g];
        if (!container.children || container.children.length === 0) continue;

        var isHBox = (container.type === "horizontalBox" || container.groupRole === "horizontalBox");
        var isVBox = (container.type === "verticalBox"   || container.groupRole === "verticalBox");
        var isSCB  = (container.type === "scrollBox"     || container.groupRole === "scrollBox");

        if (!isHBox && !isVBox && !isSCB) continue;

        // Collect children objects.
        var children = [];
        for (var c = 0; c < container.children.length; c++) {
            var obj = objectById[container.children[c].id];
            if (obj) children.push(obj);
        }
        if (children.length === 0) continue;

        if (isHBox || isVBox) {
            // Sum all child widths (HBox) or heights (VBox) to compute fill ratios.
            var containerSpan = isHBox ? container.width : container.height;
            var childrenSum = 0;
            for (var ci = 0; ci < children.length; ci++) {
                childrenSum += isHBox ? children[ci].width : children[ci].height;
            }
            var spanForRatio = (childrenSum > 0) ? childrenSum : (containerSpan > 0 ? containerSpan : 1);

            for (var ci2 = 0; ci2 < children.length; ci2++) {
                var child = children[ci2];
                var childSpan = isHBox ? child.width : child.height;
                var fillRatio = Math.round((childSpan / spanForRatio) * 10000) / 10000;
                var sizeRule = (childSpan > 0) ? "Fill" : "Auto";
                child.childSlot = {
                    sizeRule:            sizeRule,
                    fillRatio:           fillRatio,
                    horizontalAlignment: child.childSlot ? child.childSlot.horizontalAlignment : "Fill",
                    verticalAlignment:   child.childSlot ? child.childSlot.verticalAlignment   : "Fill",
                    padding:             child.childSlot ? child.childSlot.padding              : [0, 0, 0, 0]
                };
            }
        }

        if (isSCB) {
            // ScrollBox children stack vertically. Write localX/localY as padding
            // so the importer can reproduce the spacing seen in the PSD.
            for (var si = 0; si < children.length; si++) {
                var schild = children[si];
                var topPad  = schild.localY > 0 ? schild.localY : 0;
                var leftPad = schild.localX > 0 ? schild.localX : 0;
                schild.childSlot = {
                    horizontalAlignment: "Fill",
                    verticalAlignment:   "Top",
                    padding: [leftPad, topPad, 0, 0]
                };
            }
        }
    }
}

// GROUPED CHECKBOX MODIFICATION - collect checkbox items for each CHKG_ group.
//
// Supports two CHK_ child shapes inside a CHKG_ container:
//
//   Flat art layer  (kind === "layer",  type === "checkbox")
//     CHKG_TextureQuality
//       CHK_Low      ← ArtLayer
//       CHK_Medium   ← ArtLayer
//       CHK_High     ← ArtLayer
//
//   Nested group    (kind === "group",  type === "checkbox")
//     CHKG_TextureQuality
//       CHK_Low      ← LayerSet  (contains BOX_, CHKMARK_, TXT_ sub-layers)
//       CHK_Medium   ← LayerSet
//       CHK_High     ← LayerSet
//
// For each qualifying child this function stamps:
//   checkboxGroupSafeName  – the CHKG_ container's safeName with the "CHKG_"
//                            prefix stripped so UE variable names stay clean:
//                            e.g. CHKG_TextureQuality → "TextureQuality"
//   checkboxGroupId        – id of the CHKG_ container entry
//   checkboxGroupIndex     – 0-based position inside this group
//
// These are the exact fields the UE importer reads from each CHK_ object's
// JSON entry to build the CheckboxGroupAccumulator.
//
// The CHKG_ group entry also receives:
//   checkboxGroupItems     – ordered array of { id, safeName } for all members
//   checkboxGroupChildren  – same data under the name the newer importer path uses
function collectCheckboxGroupItems() {

    // Build a flat id→entry lookup covering both groups and layers so we can
    // resolve child references regardless of whether they are LayerSets or ArtLayers.
    var entryById = {};
    var i;
    for (i = 0; i < exportedGroups.length; i++) {
        entryById[exportedGroups[i].id] = exportedGroups[i];
    }
    for (i = 0; i < exportedLayers.length; i++) {
        entryById[exportedLayers[i].id] = exportedLayers[i];
    }

    for (i = 0; i < exportedGroups.length; i++) {
        var group = exportedGroups[i];
        if (group.type !== "checkboxGroup") continue;

        // Strip "CHKG_" prefix from the safe name for clean UE variable names.
        // e.g. "CHKG_TextureQuality" → "TextureQuality"
        var rawGroupSafe  = group.safeName || group.name || "";
        var cleanGroupName = rawGroupSafe.replace(/^CHKG_/i, "");

        var items = [];
        var children = group.children || [];

        for (var c = 0; c < children.length; c++) {
            var childRef = children[c];

            // Accept both flat art layers (kind === "layer") and
            // compound groups (kind === "group") that are checkbox type.
            var isCheckboxKind =
                childRef.type === "checkbox" ||
                childRef.type === "toggleButton" ||
                childRef.role === "checkbox";

            if (!isCheckboxKind) continue;

            // Resolve to the full entry so we can stamp fields on the real object.
            var childEntry = entryById[childRef.id];
            if (!childEntry) continue;

            var idx = items.length;

            // Stamp the three fields the UE importer reads from each CHK_ entry.
            childEntry.checkboxGroupId         = group.id;
            childEntry.checkboxGroupSafeName   = cleanGroupName;
            childEntry.checkboxGroupIndex      = idx;

            items.push({
                id:       childEntry.id,
                safeName: childEntry.safeName || childEntry.name
            });
        }

        if (items.length >= 2) {
            // Write the forward-reference list onto the CHKG_ parent under both
            // field names so both old and new importer paths resolve it correctly.
            group.checkboxGroupItems    = items;
            group.checkboxGroupChildren = items;
        }
    }
}

try {
    _exportTotal = countImageLayers(doc);
    _exportCancelled = false;
    showProgressWindow("UI Widget Builder - Exporting PSD…", Math.max(_exportTotal, 1));

    walkLayers(doc, [], []);
applyButtonVisibilityTargets();

if (autoFillBtnStates)
{
    autoFillMissingButtonStates();
}
    applyGridPanelSlots();
    applyAutoLayoutChildSlots();
    resolveSliderDefaultValues();
    collectCheckboxGroupItems();

    var result = {
        schemaVersion: "2.1",
        exporter: { name: "UIWidgetBuilder_PSDExporter.jsx", version: "2.1.25-solid-color-option-auto-fill-states" },
        features: { autoFillButtonStates: autoFillBtnStates },
        document: { name: baseDocName, width: px(doc.width), height: px(doc.height) },
        groups: exportedGroups,
        layers: exportedLayers,
        warnings: warnings
    };

    var jsonFile = new File(outFolder.fsName + "/layout.json");
    jsonFile.encoding = "UTF-8";
    if (!jsonFile.open("w")) { alert("Failed to open JSON file for writing:\n" + jsonFile.fsName); return; }
    jsonFile.write("\uFEFF" + toJsonString(result, "  ", 0));
    jsonFile.close();

    var message = "Export complete.\n\nGroups exported: " + exportedGroups.length + "\nLayers exported: " + exportedLayers.length + "\nWarnings: " + warnings.length + "\n\nFolder:\n" + outFolder.fsName;
    if (warnings.length > 0) message += "\n\nFirst warning:\n" + warnings[0];
    closeProgressWindow();
    alert(message);
} catch (err) {
    closeProgressWindow();
    if (_exportCancelled || err.message === "Export cancelled by user.") {
        alert("Export was cancelled.\n\nPartial output may exist in:\n" + (outFolder ? outFolder.fsName : "(unknown)"));
    } else {
        alert("Export failed:\n" + err.message);
    }
} finally {
    closeProgressWindow();
    app.preferences.rulerUnits = oldRulerUnits;
}
}

// ════════════════════════════════════════════════════════════════
//  MENU UI
// ════════════════════════════════════════════════════════════════

(function () {

    // ── Helpers ──────────────────────────────────────────────────────────────
    function makeSep(parent) {
        var sep = parent.add("panel", undefined, undefined);
        sep.alignment   = "fill";
        sep.maximumSize = [9999, 2];
        sep.minimumSize = [0,    2];
        sep.size        = [0,    2];
        uiwbSetBg(sep, [0.52, 0.30, 0.10, 1.0]);
        return sep;
    }

    // ── Dialog ───────────────────────────────────────────────────────────────
    var dlg = new Window("dialog", "UI Widget Builder - PSD Exporter", undefined, {resizable: false});
    dlg.orientation   = "column";
    dlg.alignChildren = ["fill", "top"];
    dlg.margins       = [18, 18, 18, 18];
    dlg.spacing       = 10;
    dlg.preferredSize = [420, -1];

    // ── Header ───────────────────────────────────────────────────────────────
    var hdr = dlg.add("group");
    hdr.orientation   = "row";
    hdr.alignChildren = ["fill", "center"];

    var titleTxt = hdr.add("statictext", undefined, "PSD  \u2192  UMG  Exporter");
    titleTxt.graphics.font = ScriptUI.newFont("Arial", "BOLD", 15);
    titleTxt.alignment     = ["left", "center"];
    uiwbSetFg(titleTxt, [0.96, 0.64, 0.18, 1.0]);

    var verTxt = hdr.add("statictext", undefined, "v2.2");
    verTxt.graphics.font = ScriptUI.newFont("Arial", "REGULAR", 10);
    verTxt.alignment     = ["right", "center"];
    uiwbSetFg(verTxt, [0.85, 0.56, 0.16, 1.0]);

    makeSep(dlg);

    // ── Document info ────────────────────────────────────────────────────────
    var infoPanel = dlg.add("panel", undefined, "Current Document");
    infoPanel.orientation   = "column";
    infoPanel.alignChildren = ["fill", "top"];
    infoPanel.margins       = [10, 14, 10, 10];
    infoPanel.spacing       = 4;

    var docName = infoPanel.add("statictext", undefined, "\u2014");
    var docSize = infoPanel.add("statictext", undefined, "\u2014");
    docName.graphics.font = ScriptUI.newFont("Arial", "BOLD", 11);
    docSize.graphics.font = ScriptUI.newFont("Arial", "REGULAR", 10);

    // Keep the default export beside this JSX file, regardless of where the
    // active PSD is stored. This lets the exporter remain portable when the
    // script and plugin folder are moved together.
    var exportPrefs = loadUIWBExportPrefs();

    var defaultExportPath = "";
    try {
        defaultExportPath = new File($.fileName).parent.fsName;
    } catch (scriptPathError) {
        try { defaultExportPath = Folder.current.fsName; } catch (fallbackPathError) {}
    }

    if (exportPrefs.rememberPath && exportPrefs.exportPath.length > 0) {
        defaultExportPath = exportPrefs.exportPath;
    }

    if (app.documents.length > 0) {
        var d = app.activeDocument;
        docName.text = d.name;
        docSize.text = Math.round(d.width.as("px")) + " \u00d7 " + Math.round(d.height.as("px")) + " px";
    } else {
        docName.text = "No document open";
        docSize.text = "Open a PSD first.";
    }

    makeSep(dlg);

    // ── Export path ──────────────────────────────────────────────────────────
    var pathPanel = dlg.add("panel", undefined, "Export Folder");
    pathPanel.orientation   = "column";
    pathPanel.alignChildren = ["fill", "top"];
    pathPanel.margins       = [10, 14, 10, 10];
    pathPanel.spacing       = 6;

    var pathHint = pathPanel.add("statictext", undefined,
        "Uses the remembered folder, or this JSX file's folder by default.");
    pathHint.graphics.font = ScriptUI.newFont("Arial", "REGULAR", 10);

    var pathRow = pathPanel.add("group");
    pathRow.orientation   = "row";
    pathRow.alignChildren = ["fill", "center"];
    pathRow.spacing       = 6;

    var pathInput = pathRow.add("edittext", undefined, defaultExportPath);
    pathInput.preferredSize = [290, 22];
    pathInput.helpTip       = "Absolute path to the output folder.";

    var btnBrowse = pathRow.add("button", undefined, "Browse\u2026");
    btnBrowse.preferredSize = [70, 22];

    btnBrowse.onClick = function () {
        var picked = Folder.selectDialog("Choose default export folder");
        if (picked) {
            pathInput.text = picked.fsName;
            exportPrefs.exportPath = picked.fsName;
            if (chkRememberPath && chkRememberPath.value) {
                exportPrefs.rememberPath = true;
                saveUIWBExportPrefs(exportPrefs);
            }
        }
    };

    var chkRememberPath = pathPanel.add("checkbox", undefined, "Remember this path as the default");
    chkRememberPath.value = exportPrefs.rememberPath;
    chkRememberPath.helpTip = "Use this export folder the next time the JSX exporter opens.";

    chkRememberPath.onClick = function () {
        var currentPath = (pathInput.text || "").replace(/^\s+|\s+$/g, "");
        if (chkRememberPath.value) {
            exportPrefs.rememberPath = true;
            exportPrefs.exportPath = currentPath;
            if (currentPath.length === 0 || !saveUIWBExportPrefs(exportPrefs)) {
                chkRememberPath.value = false;
                exportPrefs.rememberPath = false;
                alert("The export path could not be saved. Please choose a valid folder and try again.");
            }
        } else {
            exportPrefs.rememberPath = false;
            saveUIWBExportPrefs(exportPrefs);
        }
    };

    pathInput.onChange = function () {
        var currentPath = (pathInput.text || "").replace(/^\s+|\s+$/g, "");
        exportPrefs.exportPath = currentPath;
        if (chkRememberPath.value && currentPath.length > 0) {
            exportPrefs.rememberPath = true;
            saveUIWBExportPrefs(exportPrefs);
        }
    };

    makeSep(dlg);

    // ── Export options ───────────────────────────────────────────────────────
    var optPanel = dlg.add("panel", undefined, "Export Options");
    optPanel.orientation   = "column";
    optPanel.alignChildren = ["fill", "top"];
    optPanel.margins       = [10, 14, 10, 10];
    optPanel.spacing       = 6;

    var chkVisible = optPanel.add("checkbox", undefined, "Skip invisible layers  (recommended)");
    chkVisible.value   = exportPrefs.skipVisible;
    chkVisible.helpTip = "Layers with visibility off are never exported.";

    var chkSkipExisting = optPanel.add("checkbox", undefined, "Skip textures that already exist on disk");
    chkSkipExisting.value   = exportPrefs.skipExisting;
    chkSkipExisting.helpTip = "Unchanged PNGs already in the Textures folder are kept as-is; only new or missing ones are exported.";

    var chkDeleteExisting = optPanel.add("checkbox", undefined, "Delete existing Textures folder and layout.json before export");
    chkDeleteExisting.value   = exportPrefs.deleteExisting;
    chkDeleteExisting.helpTip = "Wipes Textures/ and layout.json first, then does a clean export. Overrides \"Skip textures\" above.";

    // Mutual exclusion: delete and skip cannot both be on
    chkDeleteExisting.onClick = function () {
        if (chkDeleteExisting.value) { chkSkipExisting.value = false; }
    };
    chkSkipExisting.onClick = function () {
        if (chkSkipExisting.value) { chkDeleteExisting.value = false; }
    };

    var chkWarn = optPanel.add("checkbox", undefined, "Show warning summary after export");
    chkWarn.value   = exportPrefs.showWarning;
    chkWarn.helpTip = "Displays skipped / unsupported layer info when done.";

    var chkOpenFolder = optPanel.add("checkbox", undefined, "Reveal output folder when done");
    chkOpenFolder.value   = exportPrefs.openFolder;
    chkOpenFolder.helpTip = "Opens the export folder in Explorer / Finder after a successful run.";

    var chkSolidColor = optPanel.add("checkbox", undefined, "Optimize solid-color layers  (export as 64\u00d764 px)");
    chkSolidColor.value   = exportPrefs.solidColor;
    chkSolidColor.helpTip = "Detects flat uniform-color layers and exports them as 64\u00d764 px PNGs instead of full size.\nReal layout bounds are preserved in the JSON. Unreal stretches the texture to fit.\nLeave OFF if unsure \u2014 gradients and non-uniform layers are always exported at full size.";

    // ========== NEW CHECKBOX: Auto-fill missing button states ==========
    var chkAutoFillStates = optPanel.add("checkbox", undefined, "Auto-fill missing button states  (reuse existing textures, don't create layers)");
    chkAutoFillStates.value   = exportPrefs.autoFillBtnStates;
    chkAutoFillStates.helpTip = "If a BTN_ group has at least one state layer (e.g. IMG_Normal),\nall missing states will use the same texture in the JSON.\nNo new layers are created in Photoshop.";

    function syncExportPrefsFromControls() {
        exportPrefs.exportPath = (pathInput.text || "").replace(/^\s+|\s+$/g, "");
        exportPrefs.rememberPath = chkRememberPath.value;
        exportPrefs.skipVisible = chkVisible.value;
        exportPrefs.skipExisting = chkSkipExisting.value;
        exportPrefs.deleteExisting = chkDeleteExisting.value;
        exportPrefs.showWarning = chkWarn.value;
        exportPrefs.openFolder = chkOpenFolder.value;
        exportPrefs.solidColor = chkSolidColor.value;
        exportPrefs.autoFillBtnStates = chkAutoFillStates.value;
        return exportPrefs;
    }

    function saveExportPrefsFromControls() {
        syncExportPrefsFromControls();
        return saveUIWBExportPrefs(exportPrefs);
    }

    chkVisible.onClick = function () {
        saveExportPrefsFromControls();
    };

    chkSkipExisting.onClick = function () {
        if (chkSkipExisting.value) { chkDeleteExisting.value = false; }
        saveExportPrefsFromControls();
    };

    chkDeleteExisting.onClick = function () {
        if (chkDeleteExisting.value) { chkSkipExisting.value = false; }
        saveExportPrefsFromControls();
    };

    chkWarn.onClick = function () {
        saveExportPrefsFromControls();
    };

    chkOpenFolder.onClick = function () {
        saveExportPrefsFromControls();
    };

    chkSolidColor.onClick = function () {
        saveExportPrefsFromControls();
    };

    chkAutoFillStates.onClick = function () {
        saveExportPrefsFromControls();
    };

    var optButtonRow = optPanel.add("group");
    optButtonRow.orientation = "row";
    optButtonRow.alignChildren = ["right", "center"];
    optButtonRow.alignment = ["fill", "center"];

    var btnResetDefaults = optButtonRow.add("button", undefined, "Reset to default");
    btnResetDefaults.alignment = ["right", "center"];
    uiwbSetFg(btnResetDefaults, [0.96, 0.64, 0.18, 1.0]);

    btnResetDefaults.onClick = function () {
        exportPrefs = getUIWBDefaultExportPrefs();

        pathInput.text = defaultExportPath;
        chkRememberPath.value = exportPrefs.rememberPath;
        chkVisible.value = exportPrefs.skipVisible;
        chkSkipExisting.value = exportPrefs.skipExisting;
        chkDeleteExisting.value = exportPrefs.deleteExisting;
        chkWarn.value = exportPrefs.showWarning;
        chkOpenFolder.value = exportPrefs.openFolder;
        chkSolidColor.value = exportPrefs.solidColor;
        chkAutoFillStates.value = exportPrefs.autoFillBtnStates;

        saveUIWBExportPrefs(exportPrefs);
    };

    makeSep(dlg);

    // ── Status ───────────────────────────────────────────────────────────────
    var statusGrp = dlg.add("group");
    statusGrp.orientation   = "row";
    statusGrp.alignChildren = ["fill", "center"];
    statusGrp.margins       = [2, 0, 0, 0];

    var statusDot  = statusGrp.add("statictext", undefined, "\u25cf");
    var statusText = statusGrp.add("statictext", undefined, "");
    statusText.preferredSize = [340, 18];
    statusText.graphics.font = ScriptUI.newFont("Arial", "REGULAR", 10);
    uiwbSetFg(statusText, [0.94, 0.75, 0.42, 1.0]);

    function setStatus(state, msg) {
        var COLOR_OK      = [0.2,  0.8,  0.3,  1];
        var COLOR_ERROR   = [1.0,  0.3,  0.2,  1];
        var COLOR_WARN    = [1.0,  0.75, 0.1,  1];
        var COLOR_RUNNING = [0.3,  0.6,  1.0,  1];
        var col = state === "error"   ? COLOR_ERROR
                : state === "warn"    ? COLOR_WARN
                : state === "running" ? COLOR_RUNNING
                : COLOR_OK;
        statusDot.graphics.foregroundColor =
            statusDot.graphics.newPen(statusDot.graphics.PenType.SOLID_COLOR, col, 1);
        statusText.text = msg;
    }

    setStatus("ok", "Exporter embedded \u2014 ready.");

    makeSep(dlg);

    // ── Bottom buttons ───────────────────────────────────────────────────────
    var btnRow = dlg.add("group");
    btnRow.orientation   = "row";
    btnRow.alignment     = "fill";
    btnRow.alignChildren = ["fill", "center"];
    btnRow.spacing       = 8;

    var btnCancel = btnRow.add("button", undefined, "Close");
    btnCancel.preferredSize = [70, 28];
    uiwbSetFg(btnCancel, [0.94, 0.94, 0.94, 1.0]);

    var btnHelp = btnRow.add("button", undefined, "Help / Prefixes");
    btnHelp.preferredSize = [110, 28];
    uiwbSetFg(btnHelp, [0.94, 0.82, 0.44, 1.0]);

    var spacerGrp = btnRow.add("group");
    spacerGrp.alignment = ["fill", "center"];

    var btnPrep = btnRow.add("button", undefined, "\u270e  Prep Layers");
    btnPrep.preferredSize  = [110, 28];
    btnPrep.helpTip        = "Scan all text layers without a known prefix and add TXT_ automatically.";
    uiwbSetFg(btnPrep, [0.94, 0.94, 0.94, 1.0]);

    var btnFillStates = btnRow.add("button", undefined, "\u29bf  Fill States");
    btnFillStates.preferredSize = [100, 28];
    btnFillStates.helpTip       = "Find BTN_ groups with missing button states and duplicate layers to fill the gaps.";
    uiwbSetFg(btnFillStates, [0.94, 0.94, 0.94, 1.0]);

    var btnExport = btnRow.add("button", undefined, "\u25b6  Export PSD");
    btnExport.preferredSize = [120, 30];
    uiwbSetFg(btnExport, [0.98, 0.70, 0.24, 1.0]);

    // ── Handlers ─────────────────────────────────────────────────────────────
    btnCancel.onClick = function () { dlg.close(); };

    btnHelp.onClick = function () {
        var helpText =
            "UI Widget Builder - PSD Exporter Help & Layer Prefix Guide\n" +
            "\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\n\n" +
            "CORE WIDGET PREFIXES\n\n" +
            "  BTN_                 Button\n" +
            "  TXT_ / LABEL_        TextBlock\n" +
            "  IMG_ / BG_ / ICO_    Image, background, or icon\n" +
            "  SLD_                 Slider\n" +
            "  RSLD_ / RSL_ / RADSLD_  Radial Slider\n" +
            "  CHK_ / TGL_          CheckBox / toggle button\n" +
            "  CHKG_                Exclusive checkbox group\n" +
            "  TXI_ / TXIM_         EditableText, single / multi-line\n" +
            "  ETB_ / ETBM_         EditableTextBox, single / multi-line\n" +
            "  CMB_ / OPT_          ComboBox / option text\n" +
            "  SPN_ / PGB_          SpinBox / ProgressBar\n\n" +
            "CONTAINERS AND LAYOUT\n\n" +
            "  CAN_                 Screen canvas\n" +
            "  HBX_ / VBX_          HorizontalBox / VerticalBox\n" +
            "  WBX_ / UGP_          WrapBox / UniformGridPanel\n" +
            "  GRD_ / GDP_ / GPN_   GridPanel\n" +
            "  LSV_ / LST_          ListView\n" +
            "  TLV_ / TIL_          TileView\n" +
            "  TRV_ / TVW_          TreeView\n" +
            "  WSW_ / WIS_          WidgetSwitcher\n" +
            "  SCB_ / SCR_          ScrollBox\n" +
            "  OVL_ / OLY_          Overlay\n" +
            "  SFZ_ / SAFE_         SafeZone\n" +
            "  SCX_ / SCL_ / SBX_   ScaleBox\n" +
            "  SZB_ / SIZE_         SizeBox\n" +
            "  STB_ / STK_          StackBox\n" +
            "  BDR_                 Border\n" +
            "  PNL_ / GRP_          Panel / generic group\n" +
            "  SPS_                 Spacer, e.g. SPS_16,8\n\n" +
            "COMPOUND WIDGET PARTS\n\n" +
            "  BAR_ / FILL_         Track, progress, or fill image\n" +
            "  THM_ / RTHM_         Slider / radial slider thumb\n" +
            "  BOX_ / CHKMARK_      Checkbox box / checked image\n" +
            "  ARW_ / OPTBG_        Combo arrow / option background\n" +
            "  SCB_S_ / SCR_S_      Custom ScrollBox viewport marker\n" +
            "  SCB_H_ / SCR_H_      Horizontal ScrollBox\n" +
            "  SCB_V_ / SCR_V_      Vertical ScrollBox\n\n" +
            "BUTTON STATES AND ACTIONS\n\n" +
            "  IMG_Normal           Default state\n" +
            "  IMG_Hover            Hovered state\n" +
            "  IMG_Pressed          Pressed state\n" +
            "  IMG_Disabled         Disabled state\n" +
            "  BTN_Close            Close its parent container\n" +
            "  BTN_Exit             Export an exit-action placeholder\n" +
            "  Matching BTN_/group names toggle that group.\n" +
            "  Matching a WSW_ child creates a switch-tab action.\n\n" +
            "SMART WORKFLOWS\n\n" +
            "  CHKG_                Build an exclusive checkbox group from CHK_/TGL_ children\n" +
            "  WSW_ / WIS_          Turn a folder into a tabbed WidgetSwitcher\n" +
            "  BTN_ + WSW_ child    Switch to a tab/page by button click\n" +
            "  BTN_ + target group  Toggle visibility for matching UI panels\n" +
            "  BTN_Close            Close the parent screen or container\n" +
            "  BTN_Exit             Generate an exit placeholder for game-side hookup\n" +
            "  BTN_ + level logic   Generate open-level or create-widget actions\n" +
            "  Slider / Image / Text smart presets generate logic automatically\n\n" +
            "AUTOMATIC EXPORT DATA\n\n" +
            "  Nested hierarchy, local position, size, anchor, pivot,\n" +
            "  opacity, Z-order, grid slots, and auto-layout fill ratios.\n" +
            "  Text includes font, size, color, alignment, wrapping,\n" +
            "  tracking, leading, capitalization, and RTL direction.\n" +
            "  Slider values are calculated from BAR_ and THM_ geometry.\n" +
            "  CHKG_ children receive ordered exclusive-group metadata.\n\n" +
            "TEXTURES\n\n" +
            "  Append _IDN_A (or supported _A / _B suffixes) to reuse\n" +
            "  one exported PNG across related layers or button states.\n" +
            "  Solid Color Optimization exports uniform art at 64 x 64\n" +
            "  while preserving its original widget bounds and alpha.\n\n" +
            "OUTPUT\n\n" +
            "  layout.json          Widget tree, styling, and interactions\n" +
            "  Textures/            Exported PNG assets\n" +
            "  Prep Layers          Finds unprefixed visible design layers";

        var helpDialog = new Window(
            "dialog",
            "UI Widget Builder - PSD Exporter Help",
            undefined,
            {resizable: true}
        );
        helpDialog.orientation = "column";
        helpDialog.alignChildren = ["fill", "fill"];
        helpDialog.margins = [14, 14, 14, 14];
        helpDialog.spacing = 10;
        helpDialog.preferredSize = [760, 840];

        var aboutPanel = helpDialog.add("panel", undefined, "About the Developer");
        aboutPanel.orientation = "column";
        aboutPanel.alignChildren = ["fill", "top"];
        aboutPanel.margins = [12, 12, 12, 12];
        aboutPanel.spacing = 6;

        var aboutHeader = aboutPanel.add("group");
        aboutHeader.orientation = "row";
        aboutHeader.alignChildren = ["left", "center"];
        aboutHeader.spacing = 10;

        var aboutBadge = aboutHeader.add("statictext", undefined, "■");
        aboutBadge.graphics.font = ScriptUI.newFont("Arial", "BOLD", 18);

        var aboutHeaderText = aboutHeader.add("group");
        aboutHeaderText.orientation = "column";
        aboutHeaderText.alignChildren = ["left", "center"];
        aboutHeaderText.spacing = 0;

        var aboutTitle = aboutHeaderText.add("statictext", undefined, "About the Developer");
        aboutTitle.graphics.font = ScriptUI.newFont("Arial", "BOLD", 16);

        var aboutName = aboutHeaderText.add("statictext", undefined, UIWB_PROJECT_AUTHOR_NAME);
        aboutName.graphics.font = ScriptUI.newFont("Arial", "REGULAR", 11);

        var websiteRow = aboutPanel.add("group");
        websiteRow.orientation = "row";
        websiteRow.alignChildren = ["left", "center"];
        websiteRow.spacing = 6;

        var websiteLabel = websiteRow.add("statictext", undefined, "Website:");
        websiteLabel.preferredSize = [58, 18];

        var websiteButton = websiteRow.add("button", undefined, "LinkedIn");
        websiteButton.preferredSize = [120, 24];
        websiteButton.onClick = function () { openExternalUrl(UIWB_PROJECT_LINKEDIN_URL); };

        var productsRow = aboutPanel.add("group");
        productsRow.orientation = "row";
        productsRow.alignChildren = ["left", "center"];
        productsRow.spacing = 6;

        var productsLabel = productsRow.add("statictext", undefined, "Products:");
        productsLabel.preferredSize = [58, 18];

        var productsButton = productsRow.add("button", undefined, "Unreal Marketplace Profile");
        productsButton.preferredSize = [220, 24];
        productsButton.onClick = function () { openExternalUrl(UIWB_PROJECT_STORE_URL); };

        var licenseLine = aboutPanel.add("statictext", undefined, "License: Copyright (c) 2026 Ali Shantia. All rights reserved.");
        licenseLine.graphics.font = ScriptUI.newFont("Arial", "REGULAR", 9);

        var helpContent = helpDialog.add(
            "edittext",
            undefined,
            helpText,
            {multiline: true, scrolling: true, readonly: true}
        );
        helpContent.alignment = ["fill", "fill"];
        helpContent.preferredSize = [680, 520];

        var helpLinkRow = helpDialog.add("group");
        helpLinkRow.alignment = ["fill", "center"];
        helpLinkRow.spacing = 8;

        var docsButton = helpLinkRow.add("button", undefined, "Docs");
        docsButton.preferredSize = [72, 28];
        docsButton.onClick = function () { openExternalUrl(UIWB_PROJECT_DOCS_URL); };

        var youtubeButton = helpLinkRow.add("button", undefined, "YouTube");
        youtubeButton.preferredSize = [84, 28];
        youtubeButton.onClick = function () { openExternalUrl(UIWB_PROJECT_YOUTUBE_URL); };

        var storeButton = helpLinkRow.add("button", undefined, "Store");
        storeButton.preferredSize = [72, 28];
        storeButton.onClick = function () { openExternalUrl(UIWB_PROJECT_STORE_URL); };

        var helpLinkSpacer = helpLinkRow.add("group");
        helpLinkSpacer.alignment = ["fill", "center"];

        var helpButtonRow = helpDialog.add("group");
        helpButtonRow.alignment = ["right", "center"];
        var helpCloseButton = helpButtonRow.add("button", undefined, "Close");
        helpCloseButton.preferredSize = [90, 28];
        helpCloseButton.onClick = function () { helpDialog.close(); };

        helpDialog.onResizing = helpDialog.onResize = function () {
            this.layout.resize();
        };
        uiwbApplyImporterTheme(helpDialog);
        helpDialog.center();
        helpDialog.show();
    };


    // ── Prep Layers handler ───────────────────────────────────────────────────
    btnPrep.onClick = function () {
        if (app.documents.length === 0) {
            alert("Please open a PSD document first.");
            return;
        }

        // ── Known UMG prefixes (layers that already have one are left alone) ──
        var KNOWN_PREFIXES = [
            "TXT_", "LABEL_", "BTN_", "IMG_", "BG_", "ICO_", "PNL_",
            "BAR_", "FILL_", "THM_", "RTHM_", "BOX_", "CHKMARK_", "ARW_",
            "OPTBG_", "SLD_", "RSLD_", "RSL_", "RADSLD_", "CHK_", "TGL_",
            "CHKG_", "TXI_", "TXIM_", "ETB_", "ETBM_", "CMB_", "SPN_", "PGB_",
            "CAN_", "HBX_", "VBX_", "WBX_", "UGP_", "GRD_", "GDP_", "GPN_",
            "LSV_", "LST_", "TLV_", "TIL_", "TRV_", "TVW_", "WSW_", "WIS_",
            "SCB_", "SCR_", "OVL_", "OLY_", "SFZ_", "SAFE_", "SCX_", "SCL_",
            "SBX_", "SZB_", "SIZE_", "STB_", "STK_", "BDR_", "GRP_", "SPS_",
            "OPT_", "STATE_"
        ];

        function hasKnownPrefix(name) {
            for (var p = 0; p < KNOWN_PREFIXES.length; p++) {
                if (name.indexOf(KNOWN_PREFIXES[p]) === 0) { return true; }
            }
            return false;
        }

        // Detect the natural layer type to suggest a default prefix
        function suggestPrefix(lay) {
            if (lay.typename === "ArtLayer") {
                if (lay.kind === LayerKind.TEXT)   { return "TXT_"; }
                // Raster / pixel / smart-object → image
                if (lay.kind === LayerKind.NORMAL      ||
                    lay.kind === LayerKind.SMARTOBJECT  ||
                    lay.kind === LayerKind.SOLIDFILL    ||
                    lay.kind === LayerKind.GRADIENTFILL ||
                    lay.kind === LayerKind.PATTERNFILL) { return "IMG_"; }
            }
            return "IMG_"; // fallback
        }

        // Recursively walk visible layers; collect unprefixed text + raster layers
        function collectLayers(container, results) {
            for (var i = 0; i < container.layers.length; i++) {
                var lay = container.layers[i];
                if (!lay.visible) { continue; }
                if (lay.typename === "LayerSet") {
                    collectLayers(lay, results);
                } else if (lay.typename === "ArtLayer") {
                    var isText   = (lay.kind === LayerKind.TEXT);
                    var isRaster = (!isText && (
                        lay.kind === LayerKind.NORMAL      ||
                        lay.kind === LayerKind.SMARTOBJECT  ||
                        lay.kind === LayerKind.SOLIDFILL    ||
                        lay.kind === LayerKind.GRADIENTFILL ||
                        lay.kind === LayerKind.PATTERNFILL
                    ));
                    if ((isText || isRaster) && !hasKnownPrefix(lay.name)) {
                        var suggested = suggestPrefix(lay);
                        results.push({
                            layer:      lay,
                            oldName:    lay.name,
                            layerType:  isText ? "Text" : "Image",
                            suggested:  suggested,
                            chosenPfx:  suggested   // will be updated by dropdown
                        });
                    }
                }
            }
        }

        var doc      = app.activeDocument;
        var findings = [];
        collectLayers(doc, findings);

        if (findings.length === 0) {
            setStatus("ok", "Prep: all layers already have a prefix.");
            alert("All visible text and image layers already have a recognised prefix.\nNothing to change.");
            return;
        }

        // ── Available prefixes per type (shown in the dropdown) ───────────────
        var TEXT_PREFIXES  = ["TXT_", "LABEL_", "TXI_", "TXIM_", "ETB_", "ETBM_"];
        var IMAGE_PREFIXES = ["IMG_", "BG_", "ICO_", "PNL_", "BAR_", "FILL_",
                              "THM_", "RTHM_", "BOX_", "CHKMARK_", "ARW_", "BTN_"];

        // ── Preview dialog ────────────────────────────────────────────────────
        var preview = new Window("dialog", "Prep Layers \u2014 " + findings.length + " unprefixed layer(s)", undefined, {resizable: true});
        preview.orientation   = "column";
        preview.alignChildren = ["fill", "top"];
        preview.margins       = [12, 14, 12, 12];
        preview.spacing       = 8;
        preview.preferredSize = [640, -1];

        // Header label
        var previewHdr = preview.add("statictext", undefined,
            "Select layers to rename and choose a prefix for each:");
        previewHdr.graphics.font = ScriptUI.newFont("Arial", "BOLD", 11);

        // ── Column header row ─────────────────────────────────────────────────
        var colHdr = preview.add("group");
        colHdr.orientation   = "row";
        colHdr.alignChildren = ["left", "center"];
        colHdr.spacing       = 0;
        colHdr.margins       = [0, 0, 0, 0];

        function makeHdrCell(parent, label, w) {
            var cell = parent.add("group");
            cell.preferredSize  = [w, 22];
            cell.minimumSize    = [w, 22];
            cell.maximumSize    = [w, 22];
            cell.margins        = [4, 2, 4, 2];
            cell.orientation    = "row";
            cell.alignChildren  = ["left", "center"];
            var txt = cell.add("statictext", undefined, label);
            txt.graphics.font   = ScriptUI.newFont("Arial", "BOLD", 10);
            return cell;
        }

        makeHdrCell(colHdr, "",          24);   // checkbox placeholder
        makeHdrCell(colHdr, "Layer Name", 200);
        makeHdrCell(colHdr, "Type",        60);
        makeHdrCell(colHdr, "Prefix",     110);
        makeHdrCell(colHdr, "Result",     200);

        // Thin separator under header
        var hdrSep = preview.add("panel", undefined, undefined);
        hdrSep.alignment   = "fill";
        hdrSep.maximumSize = [9999, 2];
        hdrSep.minimumSize = [0, 2];

        // ── Scrollable rows panel ─────────────────────────────────────────────
        // ScriptUI has no native scrollable container, so we use a fixed-height
        // panel and clip it; for large sets the user can resize the dialog.
        var rowsPanel = preview.add("panel", undefined, undefined);
        rowsPanel.orientation   = "column";
        rowsPanel.alignChildren = ["fill", "top"];
        rowsPanel.spacing       = 1;
        rowsPanel.margins       = [0, 4, 0, 4];
        rowsPanel.preferredSize = [620, Math.min(findings.length * 28 + 12, 320)];
        rowsPanel.alignment     = "fill";

        // Per-row state kept in a parallel array
        var rowStates = [];   // { chk, pfxDrop, resultTxt, finding }

        function makeRowCell(parent, w, h) {
            var cell = parent.add("group");
            cell.preferredSize = [w, h];
            cell.minimumSize   = [w, h];
            cell.maximumSize   = [w, h];
            cell.margins       = [4, 1, 4, 1];
            cell.orientation   = "row";
            cell.alignChildren = ["left", "center"];
            return cell;
        }

        function buildRows() {
            for (var fi = 0; fi < findings.length; fi++) {
                var f   = findings[fi];
                var row = rowsPanel.add("group");
                row.orientation   = "row";
                row.alignChildren = ["left", "center"];
                row.spacing       = 0;
                row.margins       = [0, 0, 0, 0];
                row.preferredSize = [-1, 26];

                // Checkbox
                var chkCell = makeRowCell(row, 24, 26);
                var chk     = chkCell.add("checkbox", undefined, "");
                chk.value   = true;

                // Layer name (truncated display)
                var nameCell = makeRowCell(row, 200, 26);
                var nameTxt  = nameCell.add("statictext", undefined, f.oldName);
                nameTxt.preferredSize     = [188, 18];
                nameTxt.graphics.font     = ScriptUI.newFont("Arial", "REGULAR", 10);

                // Type badge
                var typeCell = makeRowCell(row, 60, 26);
                var typeTxt  = typeCell.add("statictext", undefined, f.layerType);
                typeTxt.graphics.font = ScriptUI.newFont("Arial", "REGULAR", 10);

                // Prefix dropdown
                var pfxCell  = makeRowCell(row, 110, 26);
                var pfxList  = (f.layerType === "Text") ? TEXT_PREFIXES : IMAGE_PREFIXES;
                var pfxDrop  = pfxCell.add("dropdownlist", [0,0,100,20], pfxList);
                pfxDrop.selection = 0;  // default matches suggested prefix index
                // Set dropdown to the suggested prefix
                for (var pi = 0; pi < pfxList.length; pi++) {
                    if (pfxList[pi] === f.suggested) { pfxDrop.selection = pi; break; }
                }

                // Result preview
                var resCell  = makeRowCell(row, 200, 26);
                var resTxt   = resCell.add("statictext", undefined, pfxDrop.selection.text + f.oldName);
                resTxt.preferredSize  = [188, 18];
                resTxt.graphics.font  = ScriptUI.newFont("Arial", "REGULAR", 10);

                // Update result label when prefix changes
                (function(drop, result, finding) {
                    drop.onChange = function () {
                        result.text = drop.selection ? drop.selection.text + finding.oldName : finding.oldName;
                        finding.chosenPfx = drop.selection ? drop.selection.text : finding.suggested;
                    };
                })(pfxDrop, resTxt, f);

                rowStates.push({ chk: chk, pfxDrop: pfxDrop, resultTxt: resTxt, finding: f });
            }
        }

        buildRows();

        // ── Footer controls ───────────────────────────────────────────────────
        var footSep = preview.add("panel", undefined, undefined);
        footSep.alignment   = "fill";
        footSep.maximumSize = [9999, 2];
        footSep.minimumSize = [0, 2];

        var previewBtnRow = preview.add("group");
        previewBtnRow.orientation   = "row";
        previewBtnRow.alignChildren = ["fill", "center"];
        previewBtnRow.spacing       = 8;
        previewBtnRow.margins       = [0, 4, 0, 0];

        var btnSelAll  = previewBtnRow.add("button", undefined, "Select All");
        btnSelAll.preferredSize  = [90, 24];
        var btnSelNone = previewBtnRow.add("button", undefined, "Select None");
        btnSelNone.preferredSize = [90, 24];

        var pSpacer = previewBtnRow.add("group");
        pSpacer.alignment = ["fill", "center"];

        var btnApply   = previewBtnRow.add("button", undefined, "Apply Renames");
        btnApply.preferredSize  = [110, 26];
        var btnPCancel = previewBtnRow.add("button", undefined, "Cancel");
        btnPCancel.preferredSize = [70, 26];

        // ── Handlers ─────────────────────────────────────────────────────────
        btnSelAll.onClick  = function () {
            for (var i = 0; i < rowStates.length; i++) { rowStates[i].chk.value = true; }
        };
        btnSelNone.onClick = function () {
            for (var i = 0; i < rowStates.length; i++) { rowStates[i].chk.value = false; }
        };
        btnPCancel.onClick = function () { preview.close(); };

        btnApply.onClick = function () {
            var toRename = [];
            for (var i = 0; i < rowStates.length; i++) {
                if (rowStates[i].chk.value) {
                    var rs  = rowStates[i];
                    var pfx = rs.pfxDrop.selection ? rs.pfxDrop.selection.text : rs.finding.suggested;
                    toRename.push({ layer: rs.finding.layer, newName: pfx + rs.finding.oldName });
                }
            }
            if (toRename.length === 0) {
                alert("No layers selected.");
                return;
            }

            var renamed = 0;
            var failed  = 0;
            for (var r = 0; r < toRename.length; r++) {
                try {
                    toRename[r].layer.name = toRename[r].newName;
                    renamed++;
                } catch (renameErr) { failed++; }
            }

            preview.close();

            setStatus(failed > 0 ? "warn" : "ok",
                "Prep: " + renamed + " renamed" + (failed > 0 ? ", " + failed + " failed." : "."));
            alert("Prep complete.\n\nRenamed: " + renamed + " layer(s)" +
                (failed > 0 ? "\nFailed:  " + failed + " layer(s)" : ""));
        };

        uiwbApplyImporterTheme(preview);
        preview.center();
        preview.show();
    };

btnFillStates.onClick = function () {
    // Ensure startsWith exists (safety net)
    if (typeof startsWith !== 'function') {
        startsWith = function(str, prefix) {
            return String(str).indexOf(prefix) === 0;
        };
    }

    try {
        if (app.documents.length === 0) {
            alert("Please open a PSD document first.");
            return;
        }

        var doc = app.activeDocument;

        // The three canonical state layer name prefixes every BTN_ group needs.
        var REQUIRED_STATES = ["IMG_Normal", "IMG_Hover", "IMG_Pressed"];

        // ── Recursively scan ALL visible groups for BTN_ ──────────────────────
        function scanForButtons(container, results) {
            for (var i = 0; i < container.layers.length; i++) {
                var layer = container.layers[i];
                if (!layer) { continue; }

                if (layer.typename === "LayerSet") {
                    if (startsWith(layer.name, "BTN_")) {
                        var foundStates   = [];
                        var stateLayerMap = {};

                        for (var j = 0; j < layer.layers.length; j++) {
                            var child = layer.layers[j];
                            if (!child) { continue; }
                            var childName = String(child.name || "");

                            for (var s = 0; s < REQUIRED_STATES.length; s++) {
                                var stateKey = REQUIRED_STATES[s];
                                if (startsWith(childName, stateKey) && !stateLayerMap[stateKey]) {
                                    stateLayerMap[stateKey] = child;
                                    foundStates.push(stateKey);
                                }
                            }
                        }

                        var missingStates = [];
                        for (var m = 0; m < REQUIRED_STATES.length; m++) {
                            if (!stateLayerMap[REQUIRED_STATES[m]]) {
                                missingStates.push(REQUIRED_STATES[m]);
                            }
                        }

                        if (missingStates.length > 0) {
                            results.push({
                                group:         layer,
                                groupName:     layer.name,
                                foundStates:   foundStates,
                                missingStates: missingStates,
                                stateLayerMap: stateLayerMap
                            });
                        }
                    }
                    scanForButtons(layer, results);
                }
            }
        }

        var findings = [];
        scanForButtons(doc, findings);

        if (findings.length === 0) {
            setStatus("ok", "Fill States: all BTN_ groups are complete.");
            alert("All BTN_ groups already have IMG_Normal, IMG_Hover, and IMG_Pressed.\nNothing to fill.");
            return;
        }

        // ── Dialog ────────────────────────────────────────────────────────────
        var fsDlg = new Window("dialog",
            "Fill Button States \u2014 " + findings.length + " incomplete BTN_ group(s)",
            undefined, {resizable: true});
        fsDlg.orientation   = "column";
        fsDlg.alignChildren = ["fill", "top"];
        fsDlg.margins       = [14, 16, 14, 14];
        fsDlg.spacing       = 8;
        fsDlg.preferredSize = [700, -1];

        var fsHdr = fsDlg.add("statictext", undefined,
            "BTN_ groups with missing states. Select groups to fix, choose a source layer, then click Fill.");
        fsHdr.graphics.font = ScriptUI.newFont("Arial", "BOLD", 11);

        // ── Column headers ────────────────────────────────────────────────────
        var fsColHdr = fsDlg.add("group");
        fsColHdr.orientation   = "row";
        fsColHdr.alignChildren = ["left", "center"];
        fsColHdr.spacing       = 0;
        fsColHdr.margins       = [2, 0, 0, 0];

        function makeFsHdrCell(parent, label, w) {
            var cell = parent.add("group");
            cell.preferredSize = [w, 20];
            cell.minimumSize   = [w, 20];
            cell.maximumSize   = [w, 20];
            cell.margins       = [4, 1, 4, 1];
            cell.orientation   = "row";
            cell.alignChildren = ["left", "center"];
            var txt = cell.add("statictext", undefined, label);
            txt.graphics.font  = ScriptUI.newFont("Arial", "BOLD", 10);
            return cell;
        }

        makeFsHdrCell(fsColHdr, "",              26);  // checkbox col
        makeFsHdrCell(fsColHdr, "BTN_ Group",   180);
        makeFsHdrCell(fsColHdr, "Has",          130);
        makeFsHdrCell(fsColHdr, "Missing",      130);
        makeFsHdrCell(fsColHdr, "Duplicate from", 180);

        var hdrSepFs = fsDlg.add("panel", undefined, undefined);
        hdrSepFs.alignment   = "fill";
        hdrSepFs.maximumSize = [9999, 2];
        hdrSepFs.minimumSize = [0, 2];

        // ── Scrollable row panel ──────────────────────────────────────────────
        var fsRowsPanel = fsDlg.add("panel", undefined, undefined);
        fsRowsPanel.orientation   = "column";
        fsRowsPanel.alignChildren = ["fill", "top"];
        fsRowsPanel.spacing       = 1;
        fsRowsPanel.margins       = [2, 4, 2, 4];
        fsRowsPanel.preferredSize = [670, Math.min(findings.length * 30 + 12, 360)];
        fsRowsPanel.alignment     = "fill";

        function makeFsRowCell(parent, w, h) {
            var cell = parent.add("group");
            cell.preferredSize = [w, h];
            cell.minimumSize   = [w, h];
            cell.maximumSize   = [w, h];
            cell.margins       = [4, 0, 4, 0];
            cell.orientation   = "row";
            cell.alignChildren = ["left", "center"];
            return cell;
        }

        // fsRowStates[i] = { chk, finding, srcDrop }
        var fsRowStates = [];

        function buildFsRow(f) {
            var row = fsRowsPanel.add("group");
            row.orientation   = "row";
            row.alignChildren = ["left", "center"];
            row.spacing       = 0;
            row.margins       = [0, 0, 0, 0];
            row.preferredSize = [-1, 28];

            var chkCell = makeFsRowCell(row, 26, 28);
            var chk     = chkCell.add("checkbox", undefined, "");
            chk.value   = (f.foundStates.length > 0);

            var nameCell = makeFsRowCell(row, 180, 28);
            var nameTxt  = nameCell.add("statictext", undefined, f.groupName);
            nameTxt.graphics.font = ScriptUI.newFont("Arial", "BOLD", 10);

            var hasCell = makeFsRowCell(row, 130, 28);
            var hasStr  = f.foundStates.length > 0
                ? f.foundStates.join(", ").replace(/IMG_/g, "")
                : "(none)";
            var hasTxt  = hasCell.add("statictext", undefined, hasStr);
            hasTxt.graphics.font = ScriptUI.newFont("Arial", "REGULAR", 10);
            uiwbSetFg(hasTxt, f.foundStates.length > 0 ? [0.35, 0.85, 0.35, 1.0] : [0.6, 0.6, 0.6, 1.0]);

            var missCell = makeFsRowCell(row, 130, 28);
            var missStr  = f.missingStates.join(", ").replace(/IMG_/g, "");
            var missTxt  = missCell.add("statictext", undefined, missStr);
            missTxt.graphics.font = ScriptUI.newFont("Arial", "REGULAR", 10);
            uiwbSetFg(missTxt, [1.0, 0.50, 0.25, 1.0]);

            var srcCell = makeFsRowCell(row, 180, 28);
            var srcDrop = null;

            if (f.foundStates.length > 0) {
                srcDrop = srcCell.add("dropdownlist", [0, 0, 168, 20], f.foundStates);
                srcDrop.selection = 0;
                for (var pi = 0; pi < f.foundStates.length; pi++) {
                    if (f.foundStates[pi] === "IMG_Normal") {
                        srcDrop.selection = pi;
                        break;
                    }
                }
            } else {
                var noSrcTxt = srcCell.add("statictext", undefined, "No state to copy from");
                noSrcTxt.graphics.font = ScriptUI.newFont("Arial", "REGULAR", 10);
                uiwbSetFg(noSrcTxt, [0.6, 0.6, 0.6, 1.0]);
                chk.enabled = false;
            }

            fsRowStates.push({ chk: chk, finding: f, srcDrop: srcDrop });
        }

        for (var fi = 0; fi < findings.length; fi++) {
            buildFsRow(findings[fi]);
        }

        // ── Footer ────────────────────────────────────────────────────────────
        var footSepFs = fsDlg.add("panel", undefined, undefined);
        footSepFs.alignment   = "fill";
        footSepFs.maximumSize = [9999, 2];
        footSepFs.minimumSize = [0, 2];

        var fsBtnRow = fsDlg.add("group");
        fsBtnRow.orientation   = "row";
        fsBtnRow.alignChildren = ["fill", "center"];
        fsBtnRow.spacing       = 8;
        fsBtnRow.margins       = [0, 4, 0, 0];

        var fsSelAll  = fsBtnRow.add("button", undefined, "Select All");
        fsSelAll.preferredSize  = [90, 24];
        var fsSelNone = fsBtnRow.add("button", undefined, "Select None");
        fsSelNone.preferredSize = [90, 24];

        var fsSpacer = fsBtnRow.add("group");
        fsSpacer.alignment = ["fill", "center"];

        var fsApply  = fsBtnRow.add("button", undefined, "\u25b6  Fill Missing States");
        fsApply.preferredSize  = [150, 26];
        uiwbSetFg(fsApply, [0.98, 0.70, 0.24, 1.0]);

        var fsCancel = fsBtnRow.add("button", undefined, "Cancel");
        fsCancel.preferredSize = [70, 26];

        fsSelAll.onClick  = function () {
            for (var i = 0; i < fsRowStates.length; i++) {
                if (fsRowStates[i].chk.enabled) { fsRowStates[i].chk.value = true; }
            }
        };
        fsSelNone.onClick = function () {
            for (var i = 0; i < fsRowStates.length; i++) { fsRowStates[i].chk.value = false; }
        };
        fsCancel.onClick = function () { fsDlg.close(); };

        fsApply.onClick = function () {
            var toProcess = [];
            for (var i = 0; i < fsRowStates.length; i++) {
                if (fsRowStates[i].chk.value && fsRowStates[i].srcDrop) {
                    toProcess.push(fsRowStates[i]);
                }
            }
            if (toProcess.length === 0) {
                alert("No BTN_ groups selected, or none have a source layer to copy from.");
                return;
            }

            var filled = 0;
            var errors = [];

            for (var p = 0; p < toProcess.length; p++) {
                var rs      = toProcess[p];
                var finding = rs.finding;

                var srcKey   = rs.srcDrop.selection ? rs.srcDrop.selection.text : finding.foundStates[0];
                var srcLayer = finding.stateLayerMap[srcKey];

                if (!srcLayer) {
                    errors.push(finding.groupName + ": source layer \"" + srcKey + "\" not found.");
                    continue;
                }

                for (var m = 0; m < finding.missingStates.length; m++) {
                    var targetName = finding.missingStates[m];
                    try {
                        app.activeDocument = doc;
                        doc.activeLayer    = srcLayer;

                        var dupLayer  = srcLayer.duplicate();
                        dupLayer.name = targetName;
                        dupLayer.move(finding.group, ElementPlacement.PLACEATBEGINNING);
                        dupLayer.visible = true;   // <-- CHANGED: now visible (enabled)
                        filled++;
                    } catch (dupErr) {
                        errors.push(finding.groupName + " \u2192 " + targetName + ": " + dupErr.message);
                    }
                }
            }

            fsDlg.close();

            var summary = "Fill States complete.\n\nStates added: " + filled;
            if (errors.length > 0) {
                summary += "\nErrors (" + errors.length + "):";
                for (var e = 0; e < errors.length; e++) {
                    summary += "\n  \u2022 " + errors[e];
                }
            }
            var statusMsg = filled + " state layer(s) created" + (errors.length > 0 ? ", " + errors.length + " error(s)." : ".");
            setStatus(errors.length > 0 ? "warn" : "ok", "Fill States: " + statusMsg);
            alert(summary);
        };

        uiwbApplyImporterTheme(fsDlg);
        fsDlg.center();
        fsDlg.show();
    } catch (e) {
        alert("Fill States ERROR:\n" + e.toString() + "\n\nLine number: " + (e.line || "unknown"));
    }
};

    btnExport.onClick = function () {
        if (app.documents.length === 0) {
            alert("Please open a PSD document first.");
            return;
        }

        // ── Resolve output folder ────────────────────────────────────────────
        var chosenPath = (pathInput.text || "").replace(/^\s+|\s+$/g, "");
        var outFolder  = null;

        if (chosenPath.length > 0) {
            outFolder = new Folder(chosenPath);
            if (!outFolder.exists) {
                var ok = confirm(
                    "The folder does not exist yet:\n" + chosenPath +
                    "\n\nCreate it now?"
                );
                if (!ok) return;
                outFolder.create();
            }
        }

        // ── Check for existing output when a path is known ───────────────────
        var doDelete     = chkDeleteExisting.value;
        var doSkip       = chkSkipExisting.value && !doDelete;
        var skipFlag     = undefined; // passed to runExporter

        if (outFolder) {
            var existJson = new File(outFolder.fsName + "/layout.json");
            var existTex  = new Folder(outFolder.fsName + "/Textures");
            var hasExist  = existJson.exists || existTex.exists;

            if (doDelete && hasExist) {
                // ── Delete mode: wipe first, then clean export ───────────────
                var confirmDelete = confirm(
                    "DELETE EXISTING CONTENT\n\n" +
                    "This will permanently delete:\n" +
                    (existJson.exists ? "  • layout.json\n" : "") +
                    (existTex.exists  ? "  • Textures/ folder and all its PNGs\n" : "") +
                    "\nin: " + outFolder.fsName +
                    "\n\nProceed?"
                );
                if (!confirmDelete) return;

                // Delete layout.json
                if (existJson.exists) { existJson.remove(); }

                // Delete all files inside Textures/, then the folder itself
                if (existTex.exists) {
                    var texFiles = existTex.getFiles();
                    for (var tf = 0; tf < texFiles.length; tf++) {
                        if (texFiles[tf] instanceof File) { texFiles[tf].remove(); }
                    }
                    existTex.remove();
                }
                skipFlag = false; // full export after clean delete

            } else if (doSkip && hasExist) {
                // ── Skip mode: inform and proceed, exporter will skip existing PNGs
                skipFlag = true;

            } else if (!doDelete && !doSkip && hasExist) {
                // ── Neither flag set: ask the user interactively ─────────────
                // Pass undefined so runExporter shows its own confirm dialog.
                skipFlag = undefined;
            }
        }

        // ── Reset shared texture state and run ───────────────────────────────
        identicalTextureGroups = {};

        // NOTE: We no longer close the dialog before exporting.
        // The progress window is a non-modal palette; it runs alongside the
        // open dialog.  ScriptUI on modern PS versions handles this correctly.
        var solidColorFlag = chkSolidColor.value;
        var autoFillStatesFlag = chkAutoFillStates.value;

        _exportCancelled = false;

        var exportError    = null;
        var exportComplete = false;

        try {
            runExporter(outFolder ? outFolder.fsName : null, skipFlag, solidColorFlag, autoFillStatesFlag);
            exportComplete = true;

            if (chkOpenFolder.value && outFolder && outFolder.exists) {
                outFolder.execute();
            }
        } catch (runErr) {
            exportError = runErr;
        }

        if (exportComplete) {
            var pathPreferenceUpdated = saveExportPrefsFromControls();

            if (pathPreferenceUpdated) {
                setStatus("ok", "Export complete.");
            } else {
                setStatus("warn", "Export complete, but the default path preference could not be updated.");
            }
        } else if (_exportCancelled) {
            setStatus("warn", "Export cancelled.");
        } else if (exportError) {
            setStatus("error", "Export error: " + exportError.message);
        }
    };

    // ── Show ─────────────────────────────────────────────────────────────────
    uiwbApplyImporterTheme(dlg);
    dlg.center();
    dlg.show();

})();