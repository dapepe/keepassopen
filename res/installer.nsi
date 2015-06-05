;NSIS i-sense r2.ce Application Stack
;with header picture
;Written by Peter Haider

;--------------------------------
;Include Modern UI

  !include "MUI.nsh"

;--------------------------------
;General

  ;Name and file
  Name "ZeyOS SDK"
  OutFile "zeysdk.exe"
  
  BrandingText "ZeyOS SDK Setup"

  ;Default installation folder
  InstallDir "$PROGRAMFILES\ZeySDK"
  
  ;Get installation folder from registry if available
  InstallDirRegKey HKCU "Zeyon\ZeySDK" ""


;--------------------------------
;Initialization

var MUI_TEMP
var STARTMENU_FOLDER

LicenseForceSelection checkbox "I accept the above licence agreement."

ShowInstDetails show
ShowUninstDetails show

;--------------------------------
;Interface Configuration

  ;Remember the installer language
  !define MUI_LANGDLL_REGISTRY_ROOT "HKCU" 
  !define MUI_LANGDLL_REGISTRY_KEY "Software\ZeySDK" 
  !define MUI_LANGDLL_REGISTRY_VALUENAME "Installer Language"
  !define MUI_ABORTWARNING
  !define MUI_ICON "icons\install.ico"
  !define MUI_UNICON "icons\uninstall.ico"


;===============================
;===============================
;Pages

  !insertmacro MUI_PAGE_WELCOME
  !insertmacro MUI_PAGE_LICENSE "eula.txt"
  !insertmacro MUI_PAGE_COMPONENTS
  !insertmacro MUI_PAGE_DIRECTORY
  
  ;Start Menu Folder Page Configuration
  !define MUI_STARTMENUPAGE_REGISTRY_ROOT "HKCU" 
  !define MUI_STARTMENUPAGE_REGISTRY_KEY "Zeyon\ZeySDK" 
  !define MUI_STARTMENUPAGE_REGISTRY_VALUENAME "ZeyOS SDK"
  
  !insertmacro MUI_PAGE_STARTMENU Application $STARTMENU_FOLDER
  
  !insertmacro MUI_PAGE_INSTFILES
  
  !insertmacro MUI_UNPAGE_CONFIRM
  !insertmacro MUI_UNPAGE_INSTFILES

  
;--------------------------------
;Languages
 
  !insertmacro MUI_LANGUAGE "English"

;--------------------------------
;Installer Sections

Section "ZeyOS SDK" SecOutlookSync

  SetOutPath "$INSTDIR"
  
  ;ADD YOUR OWN FILES HERE...
  File /r bin
  
  ;Store installation folder
  WriteRegStr HKCU "ZeyOS SDK" "" $INSTDIR
  
  ;Create uninstaller
  WriteUninstaller "$INSTDIR\Uninstall.exe"
  
  !insertmacro MUI_STARTMENU_WRITE_BEGIN Application
    
    ;Create shortcuts
    CreateDirectory "$SMPROGRAMS\$STARTMENU_FOLDER"
    CreateShortCut "$SMPROGRAMS\$STARTMENU_FOLDER\Uninstall.lnk" "$INSTDIR\Uninstall.exe"
    CreateShortCut "$SMPROGRAMS\$STARTMENU_FOLDER\ZeyOS SDK.lnk" "$INSTDIR\bin\eclipse.exe"
  
  !insertmacro MUI_STARTMENU_WRITE_END

SectionEnd

;--------------------------------
;Descriptions

  ;Language strings
  LangString DESC_SecOutlookSync ${LANG_ENGLISH} "ZeyOS SDK."

  ;Assign language strings to sections
  !insertmacro MUI_FUNCTION_DESCRIPTION_BEGIN
    !insertmacro MUI_DESCRIPTION_TEXT ${SecOutlookSync} $(DESC_SecOutlookSync)
  !insertmacro MUI_FUNCTION_DESCRIPTION_END
 
;--------------------------------
;Uninstaller Section

Section "Uninstall"

  ;ADD YOUR OWN FILES HERE...
  RMDir /r "$INSTDIR\bin"
  Delete "$INSTDIR\Uninstall.exe"

  RMDir "$INSTDIR"
  
  !insertmacro MUI_STARTMENU_GETFOLDER Application $MUI_TEMP
 
  Delete "$SMPROGRAMS\$MUI_TEMP\Uninstall.lnk"
  Delete "$SMPROGRAMS\$MUI_TEMP\ZeyOS SDK.lnk"
  
  ;Delete empty start menu parent diretories
  StrCpy $MUI_TEMP "$SMPROGRAMS\$MUI_TEMP"
 
  startMenuDeleteLoop:
	ClearErrors
    RMDir $MUI_TEMP
    GetFullPathName $MUI_TEMP "$MUI_TEMP\.."
    
    IfErrors startMenuDeleteLoopDone
  
    StrCmp $MUI_TEMP $SMPROGRAMS startMenuDeleteLoopDone startMenuDeleteLoop
  startMenuDeleteLoopDone:

  DeleteRegKey /ifempty HKCU "Zeyon\ZeySDK"

SectionEnd