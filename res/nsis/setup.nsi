;--------------------------------
;Include Modern UI

  !include "MUI.nsh"
  
;--------------------------------
;General

  !define MUI_PRODUCT "@@pkgtitle"
  !define MUI_ORG "@@pkgorg"
  !define MUI_PLATFORM "@@dir"
  !define MUI_FILE "@@pkgname"
  !define MUI_VERSION "@@pkgversion"
  !define MUI_BRANDINGTEXT "${MUI_PRODUCT} ${MUI_VERSION}"

  ;Name and file
  Name "${MUI_PRODUCT}"
  OutFile "${MUI_FILE}-${MUI_VERSION}.exe"
  BrandingText "${MUI_PRODUCT} Setup ${MUI_VERSION}"

  ;Default installation folder
  InstallDir "$PROGRAMFILES\${MUI_PRODUCT}"
  
  ;Get installation folder from registry if available
  InstallDirRegKey HKCU "${MUI_ORG}\${MUI_PRODUCT}" ""


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
  !define MUI_LANGDLL_REGISTRY_KEY "Software\${MUI_PRODUCT}"
  !define MUI_LANGDLL_REGISTRY_VALUENAME "Installer Language"
  !define MUI_ABORTWARNING
  !define MUI_ICON "..\res\nsis\icons\install.ico"
  !define MUI_UNICON "..\res\nsis\icons\uninstall.ico"


;===============================
;===============================
;Pages

  !insertmacro MUI_PAGE_WELCOME
  !insertmacro MUI_PAGE_LICENSE "..\LICENSE.md"
  !insertmacro MUI_PAGE_COMPONENTS
  !insertmacro MUI_PAGE_DIRECTORY
  
  ;Start Menu Folder Page Configuration
  !define MUI_STARTMENUPAGE_REGISTRY_ROOT "HKCU" 
  !define MUI_STARTMENUPAGE_REGISTRY_KEY "${MUI_ORG}\${MUI_PRODUCT}" 
  !define MUI_STARTMENUPAGE_REGISTRY_VALUENAME "${MUI_PRODUCT}"
  
  !insertmacro MUI_PAGE_STARTMENU Application $STARTMENU_FOLDER
  
  !insertmacro MUI_PAGE_INSTFILES
  
  !insertmacro MUI_UNPAGE_CONFIRM
  !insertmacro MUI_UNPAGE_INSTFILES

  
;--------------------------------
;Languages
 
  !insertmacro MUI_LANGUAGE "English"

;--------------------------------
;Installer Sections

Section "${MUI_PRODUCT}" SecMain

  SetOutPath "$INSTDIR"
  
  ;ADD YOUR OWN FILES HERE...
  File /r "${MUI_PLATFORM}"
  
  ;Store installation folder
  WriteRegStr HKCU "${MUI_PRODUCT}" "" $INSTDIR
  
  ;Create uninstaller
  WriteUninstaller "$INSTDIR\Uninstall.exe"
  
  !insertmacro MUI_STARTMENU_WRITE_BEGIN Application
    
    ;Create shortcuts
    CreateDirectory "$SMPROGRAMS\$STARTMENU_FOLDER"
    CreateShortCut "$SMPROGRAMS\$STARTMENU_FOLDER\Uninstall.lnk" "$INSTDIR\Uninstall.exe"
    CreateShortCut "$SMPROGRAMS\$STARTMENU_FOLDER\${MUI_PRODUCT}.lnk" "$INSTDIR\${MUI_PLATFORM}\${MUI_FILE}.exe"
  
  !insertmacro MUI_STARTMENU_WRITE_END

SectionEnd

;--------------------------------
;Descriptions

  ;Language strings
  LangString DESC_SecMain ${LANG_ENGLISH} "${MUI_PRODUCT}."

  ;Assign language strings to sections
  !insertmacro MUI_FUNCTION_DESCRIPTION_BEGIN
    !insertmacro MUI_DESCRIPTION_TEXT ${SecMain} $(DESC_SecMain)
  !insertmacro MUI_FUNCTION_DESCRIPTION_END
 
;--------------------------------
;Uninstaller Section

Section "Uninstall"

  ;ADD YOUR OWN FILES HERE...
  RMDir /r "$INSTDIR\${MUI_PLATFORM}"
  Delete "$INSTDIR\Uninstall.exe"

  RMDir "$INSTDIR"
  
  !insertmacro MUI_STARTMENU_GETFOLDER Application $MUI_TEMP
 
  Delete "$SMPROGRAMS\$MUI_TEMP\Uninstall.lnk"
  Delete "$SMPROGRAMS\$MUI_TEMP\${MUI_PRODUCT}.lnk"
  
  ;Delete empty start menu parent diretories
  StrCpy $MUI_TEMP "$SMPROGRAMS\$MUI_TEMP"
 
  startMenuDeleteLoop:
	ClearErrors
    RMDir $MUI_TEMP
    GetFullPathName $MUI_TEMP "$MUI_TEMP\.."
    
    IfErrors startMenuDeleteLoopDone
  
    StrCmp $MUI_TEMP $SMPROGRAMS startMenuDeleteLoopDone startMenuDeleteLoop
  startMenuDeleteLoopDone:

  DeleteRegKey /ifempty HKCU "${MUI_ORG}\${MUI_PRODUCT}"

SectionEnd