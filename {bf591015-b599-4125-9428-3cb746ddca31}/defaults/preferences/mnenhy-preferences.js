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
 * Portions created by the Initial Developer are Copyright © 2002-2014
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

// version and useragent handling
pref("extensions.mnenhy.version", "");
pref("extensions.mnenhy.useragent.nooverride", false);

// default activation state
pref("extensions.mnenhy.disabled.mnenhy-headers",     false);
pref("extensions.mnenhy.disabled.mnenhy-folderstore", false);
pref("extensions.mnenhy.disabled.mnenhy-codecs",      false);
pref("extensions.mnenhy.disabled.mnenhy-mids",        false);
pref("extensions.mnenhy.disabled.mnenhy-junk",        false);
pref("extensions.mnenhy.disabled.mnenhy-sidebar",     false);
pref("extensions.mnenhy.disabled.mnenhy",             false);

// logging
// empty string means no logging, possible other values: shell, console, file
// submodules just say true/false
pref("extensions.mnenhy.log", "");
pref("extensions.mnenhy.log.installed",   false);
pref("extensions.mnenhy.log.headers",     false);
pref("extensions.mnenhy.log.folderstore", false);
pref("extensions.mnenhy.log.codecs",      false);
pref("extensions.mnenhy.log.mids",        false);
pref("extensions.mnenhy.log.junk",        false);
pref("extensions.mnenhy.log.junkicons",   false);
pref("extensions.mnenhy.log.sidebar",     false);

// headers
pref("extensions.mnenhy.headers.inline",  false);
pref("extensions.mnenhy.headers.viewmode",    1);
pref("extensions.mnenhy.headers.noxface", false);

// folderstore
// - don't save user_prefs?
pref("extensions.mnenhy.folderstore.noprefs", false);
// - always fall back to account data (if any)
pref("extensions.mnenhy.folderstore.account", false);
// - code to be executed when entering folder
pref("extensions.mnenhy.folderstore.onenter", "");
// - code to be executed when leaving folder
pref("extensions.mnenhy.folderstore.onexit", "");

// junk
pref("extensions.mnenhy.junk.noicon", false);
pref("extensions.mnenhy.junk.chunk",    250);
pref("extensions.mnenhy.junk.table",     30);
pref("extensions.mnenhy.junk.delay",      0);
pref("extensions.mnenhy.junk.threshold",  0);
//# message-id search
pref("extensions.mnenhy.mids.online",            true);
pref("extensions.mnenhy.mids.loadInMessagePane", false);
