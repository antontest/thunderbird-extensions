/* ***** BEGIN LICENSE BLOCK *****
 * Version: MPL 1.1/GPL 2.0/LGPL 2.1
 *
 * The contents of this file are subject to the Mozilla Public License Version
 * 1.1 (the "License"); you may not use this file except in compliance with
 * the License. You may obtain a copy of the License at
 * http://www.mozilla.org/MPL/
 *
 * Software distributed under the License is distributed on an "AS IS" basis,
 * WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License
 * for the specific language governing rights and limitations under the
 * License.
 *
 * The Original Code is Mnenhy.
 *
 * The Initial Developer of the Original Code is Karsten Düsterloh <kd@mnenhy.de>.
 *
 * Portions created by the Initial Developer are Copyright © 2002-2012
 * the Initial Developer. All Rights Reserved.
 *
 * Contributor(s):
 *
 * Alternatively, the contents of this file may be used under the terms of
 * either the GNU General Public License Version 2 or later (the "GPL"), or
 * the GNU Lesser General Public License Version 2.1 or later (the "LGPL"),
 * in which case the provisions of the GPL or the LGPL are applicable instead
 * of those above. If you wish to allow use of your version of this file only
 * under the terms of either the GPL or the LGPL, and not to allow others to
 * use your version of this file under the terms of the MPL, indicate your
 * decision by deleting the provisions above and replace them with the notice
 * and other provisions required by the GPL or the LGPL. If you do not delete
 * the provisions above, a recipient may use your version of this file under
 * the terms of any one of the MPL, the GPL or the LGPL.
 *
 * ***** END LICENSE BLOCK ***** */

// +-
// |  The contents of this file form a JavaScript module,
// |  only the symbols in EXPORTED_SYMBOLS can be used by consumers!
// +-
EXPORTED_SYMBOLS = ["goMnenhy"];

// load some static strings which depend upon preprocessing
Components.utils.import("resource://mnenhy/mnenhy-version.js");

// the one and only exportable Mnenhy object
var goMnenhy = null;


// |
// |  class Mnenhy
// |
function Mnenhy()
{
  // constructor

  // init "constants"
  // +---------------
  // | contract IDs
  this.ksCID_BinIStream     = "@mozilla.org/binaryinputstream;1";
  this.ksCID_ChrmRegService = "@mozilla.org/chrome/chrome-registry;1";
  this.ksCID_ConsoleService = "@mozilla.org/consoleservice;1";
  this.ksCID_PromptService  = "@mozilla.org/embedcomp/prompt-service;1";
  this.ksCID_DirService     = "@mozilla.org/file/directory_service;1";
  this.ksCID_LocalFile      = "@mozilla.org/file/local;1";
  this.ksCID_FilePicker     = "@mozilla.org/filepicker;1";
  this.ksCID_StringService  = "@mozilla.org/intl/stringbundle;1";
  this.ksCID_ZipReader      = "@mozilla.org/libjar/zip-reader;1";
  this.ksCID_LoadJSService  = "@mozilla.org/moz/jssubscript-loader;1";
  this.ksCID_BufIStream     = "@mozilla.org/network/buffered-input-stream;1";
  this.ksCID_ifstream       = "@mozilla.org/network/file-input-stream;1";
  this.ksCID_ofstream       = "@mozilla.org/network/file-output-stream;1";
  this.ksCID_IOService      = "@mozilla.org/network/io-service;1";
  this.ksCID_ObsrvrService  = "@mozilla.org/observer-service;1";
  this.ksCID_PrefService    = "@mozilla.org/preferences-service;1";
  this.ksCID_ScrIStream     = "@mozilla.org/scriptableinputstream;1";
  this.ksCID_ClipBoard      = "@mozilla.org/widget/clipboardhelper;1";
  this.ksCID_WindowMediator = "@mozilla.org/appshell/window-mediator;1";
  // | classes
  this.CFileByPath          = new Components.Constructor(this.ksCID_LocalFile, "nsILocalFile", "initWithPath");
  this.CFileByFile          = new Components.Constructor(this.ksCID_LocalFile, "nsILocalFile", "initWithFile");
  this.CEnumList            = SimpleEnumeratorList;
  this.CSort                = CMnenhySortChildNodes;
  // | services
  this.m_koIOService        = Components.classes[this.ksCID_IOService]     .getService(Components.interfaces.nsIIOService);
  this.m_koConsoleService   = Components.classes[this.ksCID_ConsoleService].getService(Components.interfaces.nsIConsoleService);
  this.m_koDirService       = Components.classes[this.ksCID_DirService]    .getService(Components.interfaces.nsIProperties);
  this.m_koPrefService      = Components.classes[this.ksCID_PrefService]   .getService(Components.interfaces.nsIPrefBranch);
  this.m_koPromptService    = Components.classes[this.ksCID_PromptService] .getService(Components.interfaces.nsIPromptService);
  this.m_koStringService    = Components.classes[this.ksCID_StringService] .getService(Components.interfaces.nsIStringBundleService);
  this.m_koObserverService  = Components.classes[this.ksCID_ObsrvrService] .getService(Components.interfaces.nsIObserverService);
  this.m_koChromeRegService = Components.classes[this.ksCID_ChrmRegService].getService(Components.interfaces.nsIXULChromeRegistry);
  this.m_koWindowMediator   = Components.classes[this.ksCID_WindowMediator].getService(Components.interfaces.nsIWindowMediator);

  // | other values
  // | pref type constants
  this.kiPrefInvalid        = this.m_koPrefService.PREF_INVALID;    //   0
  this.kiPrefWString        = 16;
  this.kiPrefString         = this.m_koPrefService.PREF_STRING;     //  32
  this.kiPrefInt            = this.m_koPrefService.PREF_INT;        //  64
  this.kiPrefBool           = this.m_koPrefService.PREF_BOOL;       // 128
  // | - RDF
  this.krsMnenhyPrefix      = ["urn","mnenhy"];
  this.ksMnenhyRDF          = "mnenhy.rdf";
  this.ksMnenhyRDFDefURI    = "chrome://mnenhy/content/" + this.ksMnenhyRDF;
  this.ksMnenhyNamespace    = "http://mnenhy.tprac.de/rdf#";
  this.ksMnenhyPropFormat   = "format";
  // | - protocol handlers
  this.ksProtocolFile       = "file";
  this.ksProtocolJar        = "jar";
  this.ksProtocolRes        = "resource";
  this.ksProtocolChrome     = "chrome";
  // | - paths
  const koDirApp = this.ConvertURI2FileURI("resource:/");
  this.m_koChromeDirApp     = this.GetSystemFile("AChrom");
  this.m_koChromeDirUser    = this.GetSystemFile("UChrm" );
  this.m_koDirApp           = koDirApp.file;
  this.m_koDirUser          = this.GetSystemFile("ProfD" );
  // | - path file URIs
  this.m_ksURIApp           = koDirApp.spec;
  this.m_ksURIUser          = this.m_koDirUser ? this.GetProtocolHandler().newFileURI(this.m_koDirUser).spec : "";
  // | - logging (must be lowercase)
  this.ksLogToShell         = "shell";
  this.ksLogToJSConsole     = "console";
  this.ksLogToFile          = "file";

  // init variable members
  // +--------------------
  // | logging
  this.m_ksLogTarget = this.GetCleanStringPref("extensions.mnenhy.log");
  // we need some flags set for useful messages (that we don't log here, but may need to get)
  if (this.m_ksLogTarget)
  {
    this.SetPref("javascript.options.strict",        this.kiPrefBool, true);
    this.SetPref("javascript.options.showInConsole", this.kiPrefBool, true);
    this.SetPref("browser.dom.window.dump.enabled",  this.kiPrefBool, true);
  }
  if (this.m_koDirUser)
  {
    // if we already have a profile, prepare the log file object
    this.m_koLogFile = this.m_koDirUser.clone();
    this.m_koLogFile.append("mnenhy.log");
  }
  else
  {
    // no profile loaded yet
    this.m_koLogFile = null;
  }
  this.Log("*** starting new logging session ***");

  // | string bundles:
  // | - Mozilla brand (Mozilla, Thunderbird, Firefox, etc.)
  this.ksMozillaBrandName = "Mozilla";
  let oBrandBundle = this.InitStringBundle("chrome://branding/locale/brand.properties");
  if (oBrandBundle)
    this.ksMozillaBrandName = this.GetString("brandShortName", oBrandBundle, true);
  this.Log("MozillaBrandName=" + this.ksMozillaBrandName);

  // | - Mozilla (Gecko) version from useragent string
  // |   (1.8a3 will be read as 1.8 here)
  // |   We need to temporarily ignore any custom settings!
  let oNavigator = this.GetNavigator();
  this.Log("UserAgent=" + (oNavigator && oNavigator.userAgent));
  this.ksPrefUAOverride = "general.useragent.override";
  const ksCustomUA = this.GetPref(this.ksPrefUAOverride, this.kiPrefString);
  this.SetPref(this.ksPrefUAOverride, this.kiPrefString, null);  // reset UA
  this.ksMozillaVersion = oNavigator && oNavigator.userAgent.match(/^Mozilla\/.+?\(.*?rv:([0-9.]+)./);
  if (ksCustomUA)
    this.SetPref(this.ksPrefUAOverride, this.kiPrefString, ksCustomUA);  // restore custom UA
  if (this.ksMozillaVersion && this.ksMozillaVersion.length)
    this.ksMozillaVersion = this.ksMozillaVersion[1];
  this.Log("MozillaVersion=" + this.ksMozillaVersion);

  // | - Mnenhy default strings
  this.m_oStringBundle = this.InitStringBundle();

  // | observer management
  this.m_oObservers  = {};
  this.m_iObserverID = 0;

  // try to init subpackages (if they exist)
  // +---------------
  // | - RDF support
  this.m_oRDF = null;
  this.rdf = {};
  if (this.Include("chrome://mnenhy/content/mnenhy-rdf.js", this.rdf)) // load the RDF class
  {
    this.rdf.Init(this);
    this.InitMnenhyRDF();
  }
  // | - init installed subpackages (needs uninstall)
  this.installed = {};
  if (this.Include("chrome://mnenhy/content/mnenhy-installed.js", this.installed))
    this.installed.Init(this);

  // Mnenhy User-Agent string
  // +------------------------------
  this.ksPrefMnenhyVersion      = "extensions.mnenhy.version";
  this.ksPrefNoMnenhyUAOverride = "extensions.mnenhy.useragent.nooverride";
  this.ksPrefUAExtraMnenhy      = "general.useragent.extra.mnenhy";
  this.ksMnenhyUUID             = MNENHY_UUID;
  this.ksMnenhyVersion          = MNENHY_VERSION;
  this.Log("MnenhyVersion=" + this.ksMnenhyVersion);
}


Mnenhy.prototype =
{
  // the Mnenhy namespace

  // |
  // |  string bundle
  // |
  InitStringBundle: function(asURL)
  {
    let oStringBundle = null;
    if (!asURL)
      asURL = "chrome://mnenhy/locale/mnenhy.properties";
    try
    {
      oStringBundle = this.m_koStringService.createBundle(asURL);
    }
    catch(ignored)
    {
      this.Log("InitStringBundle('" + asURL + "') failed");
    }
    return oStringBundle;
  },

  GetString: function(asName, aoStringBundle, abNoBranding)
  {
    let s = "";
    if (asName)
    {
      try
      {
        const koStringBundle = aoStringBundle || this.m_oStringBundle;
        if (koStringBundle)
          s = koStringBundle.GetStringFromName(asName);
        if (!abNoBranding)
          s = s.replace(/%brandShortName%/g, this.ksMozillaBrandName);
      }
      catch(oError)
      {
        this.Log("GetString('" + asName + "', " + aoStringBundle + ") failed");
      }
    }
    return s;
  },

  // ensure having a window
  EnsureWindow:  function(aoWin)
  {
    if (aoWin)
      return aoWin;
    // if no window was given, any will have to do
    return this.m_koWindowMediator.getMostRecentWindow(null);
  },


  // |
  // |  message boxen: alert/confirm
  // |
  MessageBox: function(aoWin, asContent, asTitle, asButtons, asIconClass, aiContentWidth, aiWindowWidth)
  {
    aoWin = this.EnsureWindow(aoWin);
    if (!aoWin)
      return "";
    const koText = {value:        null,
                    sTitle:       asTitle        || "",
                    iWidth:       aiContentWidth || 0,
                    sContent:     asContent      || "",
                    sButtons:     asButtons      || "",
                    iWindowWidth: aiWindowWidth  || 0,
                    sIconClass:   asIconClass    || ""}; // alert-icon, question-icon, message-icon, error-icon
    // On Mac, all windows may be closed, hence centerscreen would move the
    // dialog's center to the upper left corner of the screen!
    const ksFlags = "chrome,modal" + (aoWin.document.documentElement.clientWidth ? ",centerscreen" : "");
    aoWin.openDialog("chrome://mnenhy/content/mnenhy-dialog.xul",
                     "mnenhyMessageBox",
                     ksFlags,
                     koText);
    return koText.value;
  },
  Alert: function(asContent, asTitle, aoWin, aiContentWidth, aiWindowWidth)
  {
    if (!asTitle)
      asTitle = this.GetString("MnDialog_Alert");
    return this.MessageBox(aoWin, asContent, asTitle, "accept", "spaced alert-icon", aiContentWidth, aiWindowWidth);
  },
  Confirm: function(asContent, asTitle, aoWin, aiContentWidth, aiWindowWidth)
  {
    if (!asTitle)
      asTitle = this.GetString("MnDialog_Confirm");
    return this.MessageBox(aoWin, asContent, asTitle, null, "spaced question-icon", aiContentWidth, aiWindowWidth);
  },
  Error: function(asSourceFile, asError, asTitle, aoWin, aiContentWidth, aiWindowWidth)
  {
    if (!asTitle)
      asTitle = this.GetString("MnDialog_Error");
    return this.MessageBox(aoWin,
                           this.GetString("MnErr_Fatal") + asSourceFile + "\n" + asError,
                           asTitle,
                           "accept",
                           "spaced error-icon",
                           aiContentWidth,
                           aiWindowWidth);
  },

  AlertService: function(asContent, asTitle, aoWin)
  {
    if (!asTitle)
      asTitle = this.GetString("MnDialog_Alert");
    aoWin = this.EnsureWindow(aoWin);
    this.m_koPromptService.alert(aoWin, asTitle, asContent, aoWin);
  },
  ConfirmService: function(asContent, asTitle, aoWin)
  {
    if (!asTitle)
      asTitle = this.GetString("MnDialog_Confirm");
    aoWin = this.EnsureWindow(aoWin);
    return this.m_koPromptService.confirm(aoWin, asTitle, asContent);
  },
  PromptService: function(asContent, asDefault, asTitle, aoWin)
  {
    if (!asTitle)
      asTitle = this.GetString("MnDialog_Prompt");
    aoWin = this.EnsureWindow(aoWin);
    let oValue = {value: asDefault}, dummy = {};
    if (this.m_koPromptService.prompt(aoWin, asTitle, asContent, oValue, null, dummy))
      return oValue.value;  // OK
    else
      return null;          // Cancel
  },
  ConsoleService: function(asContent)
  {
    this.m_koConsoleService.logStringMessage(asContent);
  },


  // |
  // |  logging
  // |

  // log message
  // Possible asTargets are: "shell"   = text shell
  //                         "console" = Javascript console
  //                         "file"    = mnenhy.log in the profile directory
  // If no asTarget is given, the global value is taken,
  //  based upon the user_pref extensions.mnenhy.log
  Log: function(asText, asTarget)
  {
    if (!asTarget)
      asTarget = this.m_ksLogTarget;

    switch(asTarget)
    {
      case this.ksLogToShell:
      {
        dump("Mnenhy::" + asText + "\n");
        break;
      }

      case this.ksLogToJSConsole:
      {
        this.ConsoleService("Mnenhy::" + asText + "\n");
        break;
      }

      case this.ksLogToFile:
      {
        const kof = this.m_koLogFile;
        if (kof && !kof.exists())
          kof.create(this.m_koLogFile.NORMAL_FILE_TYPE, 0666);

        if (kof.exists())
        {
          try
          {
            // log date and time only when writing file
            const koDate = new Date;
            const kst = "[" + koDate.getFullYear()
                      + "-" + ("0" + koDate.getMonth()).substr(-2)
                      + "-" + ("0" + koDate.getDate()).substr(-2)
                      + " " + ("0" + koDate.getHours()).substr(-2)
                      + ":" + ("0" + koDate.getMinutes()).substr(-2)
                      + ":" + ("0" + koDate.getSeconds()).substr(-2)
                      + "] " + asText + "\n";
            let oStream = Components.classes[this.ksCID_ofstream]
                                    .createInstance(Components.interfaces.nsIFileOutputStream);
            oStream.init(kof, 0x12, 0x200, 0); // open as "append write only"
            oStream.write(kst, kst.length);
            oStream.close();
          }
          catch(oErr)
          {
            // if all fails, dump to shell
            this.Log("Error: Can't log '" + asText +"' to file!", this.ksLogToShell);
          }
        }
        break;
      }
    }
  },


  // dump all properties and methods of the object into a string
  Object2String: function(aoObj)
  {
    if (aoObj)
    {
      let s="";
      for (let i in aoObj)
        s+=" "+i+": "+aoObj[i]+"\n";
      return "{\n"+s+"}";
    }
    return "[null]";
  },


  GetNavigator: function()
  {
    // no window, no navigator object :-(
    const kNaviWin = this.EnsureWindow();
    return kNaviWin && kNaviWin.navigator;
  },


  // |
  // |  File I/O
  // |

  // create a nsIFileURL from the given aoURI (given as string or nsIURI)
  // if chrome, get jar or file or resource (but only take the jar file and ignore the entry path)
  //    IN:     nsIURI or string  aoURI   the URI to be converted
  //    OUT:    Array             arPath  an array of strings:  [0] the file,  e.g. file:///foo.jar
  //                                      only if [0] is a jar: [1] the entry, e.g. content/bar.rdf
  //    RETURN: nsIFileURL        the file
  ConvertURI2FileURI: function(aoURI, arPath)
  {
    let oFileURI = null;
    if (aoURI)
    {
      // the chrome registry throws exceptions in Thunderbird
      try
      {
        // with omnijar around, a resource may be a jar again etc., hence we do
        // recursive conversions until we find a nsIFileURL or nothing at all
        let bChanged = true;
        while (bChanged && !oFileURI)
        {
          // convert aoURI to nsIURI if necesary
          if (typeof(aoURI) == "string")
          {
            aoURI = this.m_koIOService.newURI(aoURI, null, null);
            bChanged = true;
          }
          // chrome:
          if (aoURI.schemeIs("chrome"))
          {
            // convert chrome to resource
            // as of about 2005-02-25, nightly builds use the new, stripped-down version of
            // nsIXULChromeRegistry, that returns a real nsIURI here
            const koResource = this.m_koChromeRegService.convertChromeURL(aoURI);
            if (koResource instanceof Components.interfaces.nsIURI)
              aoURI = koResource;
            else
              aoURI = this.m_koIOService.newURI(koResource, null, null);
            bChanged = true;
          }
          // jar:
          if (aoURI instanceof Components.interfaces.nsIJARURI)
          {
            if (arPath)
              arPath.push(aoURI.JAREntry);
            aoURI = aoURI.JARFile;
            bChanged = true;
          }
          // resource:
          if (aoURI.schemeIs("resource"))
          {
            // convert resource to file
            const ksFile = this.GetProtocolHandler("resource", Components.interfaces.nsIResProtocolHandler)
                               .resolveURI(aoURI);
            aoURI = this.m_koIOService.newURI(ksFile, null, null);
            bChanged = true;
          }
          // file:
          if (aoURI instanceof Components.interfaces.nsIFileURL)
          {
            // create nsIFile from URI
            oFileURI = aoURI;
            if (arPath)
              arPath.unshift(oFileURI.spec)
            bChanged = true;
          }
        }
      }
      catch (oError)
      {
        this.Log("Error in Mnenhy::ConvertURI2FileURI(" + aoURI.spec + "," + arPath + "):\n" + oError);
        oFileURI = null;
      }
    }
    return oFileURI;
  },


  // does the file given by this URI exist?
  //    IN:     nsIURI or string  aoURI   the URI to be checked
  //    RETURN: bool                      true = file exists
  ExistURI: function(aoURI)
  {
    if (!aoURI)
      return false;

    // first get the actual URI
    let sFileName = aoURI;
    if (aoURI instanceof Components.interfaces.nsIURI)
      sFileName = aoURI.spec;

    // try to open a synchronous(!) channel
    // we assume that the file does exist only if this does not fail
    let iLength = -1;
    let oChannel = this.m_koIOService.newChannel(sFileName, null, null);
    if (oChannel)
    {
      try
      {
        oChannel.open();
        iLength = oChannel.contentLength;
        // oChannel.close(); doesn't exist?!
        oChannel = null;
      }
      catch(error)
      {
        this.Log("Error in Mnenhy::ExistURI(" + aoURI + "):\n" + error);
      }
    }
    return iLength >= 0;
  },


  // Delete a file or directory
  //  aoParentDir   nsIFile to the file's or directory's parent directory
  //  sFileOrDir    the pathless file or directory name
  DeleteFile: function(aoParentDir, asFileOrDir)
  {
    try
    {
      let oPath = aoParentDir.clone();
      oPath.append(asFileOrDir);
      if (oPath.exists())
        oPath.remove(true);
      return null;
    }
    catch(error)
    {
      this.Log("Error in Mnenhy::DeleteFile(" + aoParentDir.path + "," + asFileOrDir + "):\n" + error);
      return error;
    }
  },


  // Rename a file or directory
  //  aoParentDir     nsIFile to the file's or directory's parent directory
  //  sFileOrDirOld   the old pathless file or directory name
  //  sFileOrDirNew   the new pathless file or directory name
  RenameFile: function(aoParentDir, asFileOrDirOld, asFileOrDirNew)
  {
    try
    {
      let oPath = aoParentDir.clone();
      oPath.append(asFileOrDirOld);
      if (oPath.exists())
        oPath.moveTo(aoParentDir, asFileOrDirNew);
      return null;
    }
    catch(oError)
    {
      this.Log("Error in Mnenhy::RenameFile(" + aoParentDir.path + "," + asFileOrDirOld + ","
               + asFileOrDirNew + "):\n" + oError);
      return oError;
    }
  },


  // Copy file or directory, but make sure that it can be copied
  //  nsIFile   aoSourceDir   directory the source file lies in
  //  string    asSourceName  name of the file/directory to copy. |null| <=> aoSourceDir is file
  //  nsIFile   aoTargetDir   target directory. |null| <=> use aoSourceDir
  //  string    asTargetName  target name of the file/directory to copy. |null| <=> use asSourceName
  //  Boolean   abClean       delete the target before copying to avoid "file already there" error?
  CopyFile: function(aoSourceDir, asSourceName, aoTargetDir, asTargetName, abClean)
  {
    try
    {
      if (aoSourceDir && asSourceName)
      {
        if (!aoTargetDir)
          aoTargetDir  = aoSourceDir;
        if (!asTargetName)
          asTargetName = asSourceName;

        let oSource = aoSourceDir.clone();
        oSource.append(asSourceName);
        if (oSource.exists())
        {
          if (abClean)
            this.DeleteFile(aoTargetDir, asTargetName);
          let oTarget = aoTargetDir.clone();
          oTarget.append(asTargetName);
          if (!oTarget.exists())
            oSource.copyTo(aoTargetDir, asTargetName);
        }
      }
      return null;
    }
    catch(oError)
    {
      this.Log("Error in Mnenhy::CopyFile(" + aoSourceDir.path + "," + asSourceName + ","
               + aoTargetDir.path + "," + asTargetName + "," + abClean + "):\n" + oError);
      return oError;
    }
  },


  // Delete a file or directory, but keep a backup copy
  //  aoParentDir     nsIFile to the file's or directory's parent directory
  //  sFileOrDir      the pathless file or directory name
  //  sFileOrDirBak   the pathless backup file or directory name
  DeleteFileWithBackup: function(aoParentDir, asFileOrDir, asFileOrDirBak)
  {
    let oError = null;
    let oPath = aoParentDir.clone();
    oPath.append(asFileOrDir);
    if (oPath.exists())
    {
      // only destroy the backup if we have a new file
      oError = this.DeleteFile(aoParentDir, asFileOrDirBak);
      if(!oError)
        oError = this.RenameFile(aoParentDir, asFileOrDir, asFileOrDirBak);
    }
    return oError;
  },


  // read nsILocalFile content into string
  ReadFile: function(oFile)
  {
    let sContent = null;
    if (oFile && oFile.exists())
    {
      let stream = Components.classes[this.ksCID_ifstream].createInstance(Components.interfaces.nsIFileInputStream);
      stream.init(oFile, 1, 0, false); // open as "read only"

      let scriptableStream = Components.classes[this.ksCID_ScrIStream].createInstance(Components.interfaces.nsIScriptableInputStream);
      scriptableStream.init(stream);

      let fileSize = scriptableStream.available();
      sContent = scriptableStream.read(fileSize);

      scriptableStream.close();
      stream.close();
    }
    return sContent;
  },

  // write string to disk as nsILocalFile
  WriteFile: function(oFile, sContent)
  {
    if (oFile)
    {
      if (oFile.exists())
        oFile.remove(true);
      oFile.create(oFile.NORMAL_FILE_TYPE, 0666);

      let oStream = Components.classes[this.ksCID_ofstream]
                              .createInstance(Components.interfaces.nsIFileOutputStream);
      oStream.init(oFile, 2, 0x200, false); // open as "write only"
      oStream.write(sContent, sContent.length);
      oStream.close();
    }
  },


  // extract the zip file oSrcFile into the destination directory oDestDir
  // extract only files matching sPattern
  ExtractZip: function(aoSrcFile,     // nsIFile
                       aoDestDir,     // nsIFile
                       asPattern,     // string = "*"
                       abIgnorePath,  // bool   = false
                       aoErrorWin)    // parent window for error messages
  {
    if (!(aoDestDir && aoSrcFile && aoSrcFile.exists()))
      return false;

    if (!asPattern)
      asPattern = "*";

    try
    {
      // open zip file
      // On 2006-05-02, the nsIZipReader interface changed:
      // init is gone and open may take the file name now!
      // Furthermore, nsIZipEntry lost its name property and findEntries changed
      // from nsISimpleEnumerator/*<nsIZipEntry>*/ to nsIUTF8StringEnumerator...
      const koZip = Components.classes[this.ksCID_ZipReader]
                              .createInstance(Components.interfaces.nsIZipReader);
      const kbIsLegacy  = "init" in koZip;
      if (kbIsLegacy)
      {
        koZip.init(aoSrcFile);
        koZip.open();
      }
      else
      {
        koZip.open(aoSrcFile);
      }

      // create destination dir
      const klPermissions = 0755;
      if(!aoDestDir.exists() || !aoDestDir.isDirectory())
      {
        aoDestDir.create(aoDestDir.DIRECTORY_TYPE, klPermissions);
      }

      // extract each and every file matching the pattern
      let oEntry, oTrgDir, sEntryName;
      let oTarget  = new this.CFileByFile(aoDestDir); // dummy file init
      let oEntries = koZip.findEntries(asPattern);
      let fHasMore = oEntries[kbIsLegacy ? "hasMoreElements" : "hasMore"];
      while(fHasMore())
      {
        oEntry = oEntries.getNext();
        if (!kbIsLegacy)
        {
          // get the nsIZipEntry for that name
          sEntryName = oEntry;
          oEntry     = koZip.getEntry(sEntryName);
        }
        if (oEntry instanceof Components.interfaces.nsIZipEntry)
        {
          // create new subdirectory if allowed and necessary
          if (kbIsLegacy)
          {
            // get the name from the nsIZipEntry
            sEntryName = oEntry.name;
          }
          oTarget.setRelativeDescriptor(aoDestDir, sEntryName);
          if (abIgnorePath)
          {
            // just take the file name and ignore the relative path
            oTarget.setRelativeDescriptor(aoDestDir, oTarget.leafName);
          }
          oTrgDir = oTarget.parent;
          if (!oTrgDir.exists())
            oTrgDir.create(oTrgDir.DIRECTORY_TYPE, klPermissions);
          if (sEntryName.substr(-1) == "/")
          {
            if (!oTarget.exists())
              oTarget.create(oTarget.DIRECTORY_TYPE, klPermissions);
          }
          else
            koZip.extract(sEntryName, oTarget);
        }
      }
      koZip.close();
    }
    catch(error)
    {
      this.Log("ExtractZip:\n"+error);
      this.Error("ExtractZip", error, null, aoErrorWin);
      return false;
    }
    return true;
  },


  // get a fully buffered binary input stream for string
  GetBinStream: function(oFile)
  {
    if (oFile && oFile.exists())
    {
      // get URI from nsIFile
      let oUri = this.m_koIOService.newFileURI(oFile);
      // open stream (channel)
      let oStream    = this.m_koIOService.newChannelFromURI(oUri).open();
      // buffer it
      let oBufStream = Components.classes[this.ksCID_BufIStream]
                                 .createInstance(Components.interfaces.nsIBufferedInputStream);
      oBufStream.init(oStream, oFile.fileSize);
      // read as binary
      let oBinStream = Components.classes[this.ksCID_BinIStream]
                                 .createInstance(Components.interfaces.nsIBinaryInputStream);
      oBinStream.setInputStream(oBufStream);
      // return it
      return oBinStream;
    }
    return null;
  },

  // get protocol handler for the given spec, eg. |http|, |chrome|, |resource|, ...
  // if aoQI is given, query the given interface
  // if no asProtocol is given, assume |file| and query to that
  GetProtocolHandler: function(asProtocol, aoQI)
  {
    if (!asProtocol)
    {
      asProtocol = this.ksProtocolFile;
      aoQI       = Components.interfaces.nsIFileProtocolHandler;
    }
    let handler = this.m_koIOService.getProtocolHandler(asProtocol);
    if (handler && aoQI)
      return handler.QueryInterface(aoQI);
    return handler;
  },


  // get the file or directory given by asID from the directory service
  // (see nsAppDirectoryServiceDefs.h or nsDirectoryServiceDefs.h for valid asIDs)
  GetSystemFile: function(asID)
  {
    try
    {
      return this.m_koDirService.get(asID, Components.interfaces.nsIFile);
    }
    catch(error)
    {
      this.Log("Error in Mnenhy::GetSystemFile(" + asID + "):\n" + error);
      return null;
    }
  },


  // |
  // |  javascript file include support
  // |

  // load a JavaScript file into the given context
  // returns |true| if everything went well and |false| otherwise
  // if abQuiet is true, no warning will be dumped
  Include: function(asURL, aoContext, abQuiet)
  {
    try
    {
      let oLoader = Components.classes[this.ksCID_LoadJSService]
                              .getService(Components.interfaces.mozIJSSubScriptLoader);
      oLoader.loadSubScript(asURL, aoContext);
      return true;
    }
    catch(oException)
    {
      if (!abQuiet)
      {
        this.Log(',--');
        this.Log('|Mnenhy.Include("' + asURL + '"):');
        this.Log('+--');
        if (typeof(oException)=="string")
          this.Log("| "+oException);
        else
          for (let s in oException)
            this.Log("| "+s+"="+oException[s])
        this.Log("`--");
      }
      return false;
    }
  },


  // |
  // |  RDF
  // |
  InitMnenhyRDF: function()
  {
    // init Mnenhy.rdf
    this.m_oRDF = new this.rdf.MnenhyRDF(this.GetMnenhyRDF(true),
                                         this.LoadedMnenhyRDF,
                                         this.ksMnenhyNamespace,
                                         this.krsMnenhyPrefix,
                                         false,
                                         this.GetMnenhyRDF(false));
  },

  MnenhyRDFConvertMoveOut: function(aoResource, aoArc, aoTarget, aoUserData)
  {
    aoUserData.RDF.Move  (aoResource, aoUserData.oNewNode, aoArc, aoTarget);
  },

  MnenhyRDFConvertMoveIn: function(aoResource, aoArc, aoTarget, aoUserData)
  {
    aoUserData.RDF.Change(aoResource, aoArc, aoTarget, aoUserData.oNewNode);
  },

  LoadedMnenhyRDF: function(aoLoadedRDF, aoUserDataIgnored)
  {
    if (!aoLoadedRDF)
    {
      if (goMnenhy)
      {
        goMnenhy.AlertService("mnenhy.js::LoadedMnenhyRDF",
                              goMnenhy.GetString("MnErr_NoRDF"));
      }
      else
      {
        dump("Error in Mnenhy.LoadedMnenhyRDF: couldn't load mnenhy.rdf!\n")
      }
    }
    else
    {
      // if we have an old version of MnenhyRDF, convert it
      if (!aoLoadedRDF.mbDataSourceCreated)
      {
        // old versions have no version number
        let iVersion = Number(aoLoadedRDF.GetItemValue("version", ["general", "main"]));
        let bConversionNeeded = iVersion < 1;
        if (bConversionNeeded)
        {
          // we need to convert certain constants!
          const ksFormat     = goMnenhy.ksMnenhyPropFormat;
          const koProperty   = aoLoadedRDF.GetItemRes(ksFormat);
          const koConversion = {text: ["cOutputText","gkiOutputText"],
                                mail: ["cOutputMail","gkiOutputMail"],
                                news: ["cOutputNews","gkiOutputNews"],
                                mid:  ["cOutputRefs","gkiOutputMID" ] };
                                // link: [] ; // no old links known yet ;-)
          for (let sNewConst in koConversion)
          {
            // process all constants
            const kiOlds = koConversion.text.length;
            for (let i = 0; i < kiOlds; ++i)
            {
              // we have two old constants for every new one
              const koValue    = aoLoadedRDF.GetLit(koConversion[sNewConst][i]);
              const koOldConst = aoLoadedRDF.moDataSource.GetSources(koProperty, koValue, true);
              while(koOldConst.hasMoreElements())
              {
                // convert it!
                const koRes = koOldConst.getNext();
                if (koRes instanceof Components.interfaces.nsIRDFResource)
                {
                  // first delete the found element, because some older versions had invalid
                  // entries that would remain and kill the mnenhy.rdf readers...
                //  aoLoadedRDF.ChangeItemValue(null, ksFormat, koRes);
                  // contruct the new element
                  let rsRes = koRes.Value.split(":");  // get the resource URI
                  rsRes.shift();  // ignore "urn"
                  rsRes.shift();  // ignore "mnenhy"
                  // We had some invalid entries in mnenhy.rdf in the past that we need to convert.
                  if (rsRes.length > 3)
                  {
                    // get the new name
                    while (rsRes.length > 3)
                      rsRes.pop();
                    // delete the node by moving all its arcs to the new one
                    const koUserData = {RDF:      aoLoadedRDF.moDataSource,
                                        oNewNode: aoLoadedRDF.GetNodeRes(rsRes)};
                    aoLoadedRDF.GetAllArcsOut(koRes, this.MnenhyRDFConvertMoveOut, koUserData);
                    aoLoadedRDF.GetAllArcsIn (koRes, this.MnenhyRDFConvertMoveIn,  koUserData);
                  }
                  // and save it
                  aoLoadedRDF.ChangeItemValue(sNewConst, ksFormat, rsRes);
                } // element is RDF resource
              } // loop over elements
            } // loop over old constants
          } // loop over contant types
          // conversion done; set correct version
          iVersion = 1;
        } // convert version < 1

        // convert version 1?
        bConversionNeeded |= iVersion < 2;
        if (bConversionNeeded)
        {
          // 2004-11-17 move prefs into preferences system
          // get all preference-like objects
          const kiViewMode  = aoLoadedRDF.GetItemValue("viewmode",  ["general:view"]);
          const kbInline    = aoLoadedRDF.GetItemValue("inline",    ["general:view"]) == "true";
          const kiThreshold = aoLoadedRDF.GetItemValue("threshold", ["general:junk"]);
          // move them into the preference tree
          goMnenhy.SetPref("extensions.mnenhy.headers.viewmode", goMnenhy.kiPrefInt,  kiViewMode);
          goMnenhy.SetPref("extensions.mnenhy.headers.inline",   goMnenhy.kiPrefBool, kbInline);
          goMnenhy.SetPref("extensions.mnenhy.junk.threshold",   goMnenhy.kiPrefInt,  kiThreshold);
          // delete the original values
          aoLoadedRDF.ChangeItemValue(null, "viewmode",  ["general:view"]);
          aoLoadedRDF.ChangeItemValue(null, "inline",    ["general:view"]);
          aoLoadedRDF.ChangeItemValue(null, "threshold", ["general:junk"]);
          // conversion done; set correct version
          iVersion = 2;
        }

        // final clean-up
        if (bConversionNeeded)
        {
          // tell the user what's going on
          goMnenhy.AlertService(goMnenhy.GetString("MnMsg_ConvPref"));
          // set new version and shutdown
          aoLoadedRDF.ChangeItemValue(iVersion, "version", "general:main");
          aoLoadedRDF.FlushDataSource();
          // shutdown Mozilla
          goMnenhy.uninstall.DeleteXulFastload();
          if (!goMnenhy.GetPref("extensions.mnenhy.noshutdown", goMnenhy.kiPrefBool))
            goMnenhy.uninstall.goQuitApplication();
        }
      } // old file found

      // make sure that we get all headers from the C++ core
      if (("headers" in goMnenhy) && ("GetHeaderView" in goMnenhy.headers))
        goMnenhy.headers.SetHeaderView(goMnenhy.headers.GetHeaderView());
    } // loaded
  },

  // get a nsIURI for the mnenhy.rdf, either for the user profile dir or the default dir
  GetMnenhyRDF: function(abUser)
  {
    let oRDFURI = null;
    if (abUser)
    {
      try
      {
        let oRDFFile = this.m_koDirUser.clone();
        oRDFFile.append(this.ksMnenhyRDF);
        oRDFURI = this.GetProtocolHandler().newFileURI(oRDFFile);
      }
      catch(ignored){}
    }
    else
    {
      oRDFURI = this.m_koIOService.newURI(this.ksMnenhyRDFDefURI, null, null);
    }
    return oRDFURI;
  },


  // |
  // |  preferences
  // |

  // open the preference dialog, select asItemID in the asContainerID branch
  // and display the asPanelURL panel
  GoPrefPanel: function(aoWindow, asPane)
  {
    if (this.installed && this.installed.IsMozilla())
    {
      aoWindow.goPreferences(asPane)
      return;
    }

    // in the aviary case, we need to open our own preference panel
    // check for an existing pref window and focus it; it's not application modal
    const koLastPrefWindow = this.m_koWindowMediator
                                 .getMostRecentWindow("mnenhy:preferences");
    if (koLastPrefWindow)
      koLastPrefWindow.focus();
    else
      aoWindow.openDialog("chrome://mnenhy/content/mnenhy-preferences.xul",
                          "MnenhyPrefWindow",
                          "chrome,titlebar,toolbar,resizable=yes",
                          asPane);
  },

  // set or delete a pref
  SetPref: function(asPref, aiType, aoVal)
  {
    try
    {
      if (aoVal !== null)
      {
        // set value
        switch (aiType)
        {
          case this.kiPrefString:
            this.m_koPrefService.setCharPref(asPref, aoVal);
            break;

          case this.kiPrefWString:
            let oString = Components.classes["@mozilla.org/supports-string;1"]
                                    .createInstance(Components.interfaces.nsISupportsString);
            oString.data = aoVal;
            this.m_koPrefService.setComplexValue(asPref, Components.interfaces.nsISupportsString, oString);
            break;

          case this.kiPrefInt:
            this.m_koPrefService.setIntPref (asPref, aoVal);
            break;

          case this.kiPrefBool:
            if (typeof(aoVal) == "string")
              aoVal = aoVal == "true";
            this.m_koPrefService.setBoolPref(asPref, aoVal); break;
            break;
        }
      }
      else
      {
        // delete pref
        if (this.m_koPrefService.prefHasUserValue(asPref))
          this.m_koPrefService.clearUserPref(asPref);
      }
    }
    catch(oError)
    {
      this.Log("SetPref(" + asPref + "," + aiType + "," + aoVal + "):\n" + oError);
    }
  },

  // get pref value or default for that type of pref
  GetPref: function(asPref, aiType, abNullOnError)
  {
    switch (aiType)
    {
      case this.kiPrefString:
        try
        {
          return this.m_koPrefService.getCharPref(asPref);
        }
        catch(ignored)
        {
          // default
          if (!abNullOnError)
            return "";
        }
        break;

      case this.kiPrefWString:
        try
        {
          return this.m_koPrefService.getComplexValue(asPref, Components.interfaces.nsIPrefLocalizedString).data;
        }
        catch(ignored)
        {
          // default
          if (!abNullOnError)
            return "";
        }
        break;

      case this.kiPrefInt:
        try
        {
          return this.m_koPrefService.getIntPref(asPref);
        }
        catch(ignored)
        {
          // default
          if (!abNullOnError)
            return 0;
        }
        break;

      case this.kiPrefBool:
        try
        {
          return this.m_koPrefService.getBoolPref(asPref);
        }
        catch(ignored)
        {
          // default
          if (!abNullOnError)
            return false;
        }
        break;
    }
    return null;
  },

  // get the type of a pref
  GetPrefType: function(asPref)
  {
    let iType = this.kiPrefInvalid;
    try
    {
      iType = this.m_koPrefService.getPrefType(asPref);
    }
    catch(oError)
    {
      this.Log("GetPrefType(" + asPref + "):\n" + oError);
    }
    return iType;
  },

  ExistPref: function(asPref)
  {
    return this.m_koPrefService.prefHasUserValue(asPref);
  },

  // delete an entire branch of prefs
  DeletePrefBranch: function(asStartingAt)
  {
    return this.m_koPrefService.deleteBranch(asStartingAt);
  },

  // get whitespace trimmed and lowercased pref value string
  GetCleanStringPref: function(asPref)
  {
    return this.GetPref(asPref, this.kiPrefString).replace(/\s/g, "").toLowerCase();
  },


  // |
  // |  observer manager
  // |
  // stores function or object references in an associative array

  // add the object to the list (or update, if it already exists)
  // if no text ID is given, a numeric ID will be created
  // do *not* use numeric IDs as asID!
  SetObserver: function(aoObserver, asID)
  {
    let sID = asID ? asID : this.m_iObserverID++;
    this.m_oObservers[sID] = aoObserver;
    return sID;
  },
  GetObserver: function(asID, abDoUnset)
  {
    const koObserver = this.m_oObservers[asID];
    if (abDoUnset)
      this.UnsetObserver(asID);
    return koObserver;
  },
  UnsetObserver: function(asID)
  {
    delete this.m_oObservers[asID];
  },


  // |
  // |  various helper functions
  // |

  // capitalize word beginnings
  Capitalize: function(sText)
  {
    return sText.toLowerCase().replace(/(^[a-z])|([^a-z][a-z])/g, function(s){return s.toUpperCase()});
  },


  // copy text to clipboard
  CopyStringToClipboard: function(sText)
  {
    let clipboard = Components.classes[this.ksCID_ClipBoard].getService(Components.interfaces.nsIClipboardHelper);
    clipboard.copyString(sText);
  },


  // show "egg timer" as "busy indicator"
  SetWaitCursor: function(aoWin)
  {
    aoWin = this.EnsureWindow(aoWin);
    if ("setCursor" in aoWin)
      aoWin.setCursor("wait");
  },
  UnsetWaitCursor: function(aoWin)
  {
    aoWin = this.EnsureWindow(aoWin);
    if ("setCursor" in aoWin)
      aoWin.setCursor("auto");
  },

  // the array object A to be sorted must provide a
  //   function Item(i)   that gets the item A[i], and a
  //   function Swap(i,j) that swaps those two items
  // start index is l, end index is r; asc = true for ascending sort order
  QuickSort: function(A, l, r, asc, aoWin)
  {
    if (!aoWin && "window" in document)
      aoWin = document.window;

    if (!("mnenhyQuickSortCount" in A))
      A["mnenhyQuickSortCount"] = (r - l + 1);

    const p = A.Item(l);  // pivot element
    let a = l;            // up counter
    let z = r;            // down

    // presort
    do
    {
      if (asc)
      {
        for (; A.Item(a) < p; ++a);
        for (; A.Item(z) > p; --z);
      }
      else
      {
        for (; A.Item(a) > p; ++a);
        for (; A.Item(z) < p; --z);
      }
      if (a <= z)
      {
        if (a != z)
          A.Swap(a, z);
        --z;
        ++a;
      }
    } while (a <= z);

    // sort
    let iSortCount = (r - l + 1);
    if (l < z)
    {
      iSortCount -= (z - l + 1);
      aoWin.setTimeout(goMnenhy.QuickSort, 1, A, l, z, asc, aoWin);
    }
    if (a < r)
    {
      iSortCount -= (r - a + 1);
      aoWin.setTimeout(goMnenhy.QuickSort, 1, A, a, r, asc, aoWin);
    }
    A["mnenhyQuickSortCount"] -= iSortCount;
  },

}; // Mnenhy.prototype



// |
// |  class SimpleEnumeratorList
// |

// SimpleEnumeratorList manages several nsISimpleEnumerator instances
// by providing a common nsISimpleEnumerator interface
// arEnums = [ nsISimpleEnumerator, ... , nsISimpleEnumerator ]
function SimpleEnumeratorList(arEnums)
{
  this.mrEnums = arEnums || [];
  this.miIndex = -1;
}

SimpleEnumeratorList.prototype =
{
  // +-
  // |  nsISimpleEnumerator
  // +-

  // check to see if any of the nsISimpleEnumerators has more elements
  // store first index in this.miIndex
  hasMoreElements: function()
  {
    let bHas = false;
    const kLen = this.mrEnums.length - 1;

    this.miIndex = -1;
    while (!bHas && (this.miIndex < kLen))
      bHas |= this.mrEnums[++this.miIndex].hasMoreElements();

    return bHas;
  },

  // as with nsISimpleEnumerator, hasMoreElements has to be called before
  getNext: function()
  {
    if ((this.miIndex in this.mrEnums) && (this.mrEnums[this.miIndex].hasMoreElements()))
      return this.mrEnums[this.miIndex].getNext();
    else
      return null;
  }
}


// |
// |  class CMnenhySortChildNodes
// |

// class for sorting the childNodes of a given (XUL) aoElement
// via the given asAttribute values
// set abLowerCase to |true| to always get lowercase values
// set abNumber    to |true| to always get Number    values
function CMnenhySortChildNodes(aoElement, asAttribute, abLowerCase, abNumber, aoWin)
{
  this.moCont  = aoElement;
  this.msAttr  = asAttribute;
  this.mbLower = abLowerCase;
  this.mbNum   = abNumber;
  this.moWin   = aoWin || this.m_koWindowMediator.getMostRecentWindow(null);

  // get the attribute value from the indexed child
  this.Item = function(ai)
  {
    let sVal  = "";
    let oElem = this.moCont.childNodes[ai];
    // take care of #text and other attributeless elements
    // by returning an empty string or zero
    if (oElem instanceof aoWin.Element)
      sVal = oElem.getAttribute(this.msAttr);
    if (this.mbLower)
      sVal = sVal.toLowerCase();
    if (this.mbNum)
      return Number(sVal);
    return sVal;
  };

  // swap to childNodes
  this.Swap = function(ai, aj)
  {
    // since we have only insertBefore but not insertAfter,
    // make sure that ai < aj and move aj first
    if (ai == aj)
      return;
    if (ai > aj)
    {
      let ah = ai;
      ai = aj;
      aj = ah;
    }
    let oi = this.moCont.childNodes[ai];
    let oj = this.moCont.childNodes[aj];
    let oBefore = oj.nextSibling;
    this.moCont.insertBefore(oj, oi);
    this.moCont.insertBefore(oi, oBefore);
  };
}


// |
// |  initialize the one-and-only global Mnenhy object this.goMnenhy
// |
function CreateMnenhy()
{
  // create exported object
  goMnenhy = new Mnenhy();

  // identify the first run of this version
  const ksLastVersion = goMnenhy.GetPref(goMnenhy.ksPrefMnenhyVersion,
                                         goMnenhy.kiPrefString);
  if (goMnenhy.ksMnenhyVersion != ksLastVersion)
  {
    // first run!
    // show a first run greeting if present and necessary
    if (MNENHY_FIRST_RUN_MESSAGE)
    {
      const ksFirstRunTitle = "Mnenhy " + goMnenhy.ksMnenhyVersion + " (first run)";
      goMnenhy.Alert(MNENHY_FIRST_RUN_MESSAGE, ksFirstRunTitle, null, 500, 600);
    }
    // remember new version, so that we don't show that twice
    goMnenhy.SetPref(goMnenhy.ksPrefMnenhyVersion,
                     goMnenhy.kiPrefString,
                     goMnenhy.ksMnenhyVersion);
  }

  // add ourself to the user-agent, if we're allowed to
  // (we check this on every startup!)
  let sVersionTag = null;
  if (!goMnenhy.GetPref(goMnenhy.ksPrefNoMnenhyUAOverride, goMnenhy.kiPrefBool))
  {
    // we're allowed to add Mnenhy to the User-Agent
    sVersionTag = "Mnenhy/" + goMnenhy.ksMnenhyVersion;
  }
  goMnenhy.SetPref(goMnenhy.ksPrefUAExtraMnenhy, goMnenhy.kiPrefString, sVersionTag);
}

CreateMnenhy();
