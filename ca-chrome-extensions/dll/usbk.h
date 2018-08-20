#ifndef _IMV_VOIP_CLIENT_APP_H
#define _IMV_VOIP_CLIENT_APP_H

#define MBAPI
#define MB_LIBEXPORT_API

enum MBCLIENTSTATE
{
	MB_CLIENT_INIT= 0,
	MB_CLIENT_INVITE=1,
	MB_CIIENT_INCOMING,
	MB_CIIENT_CONNECTED,
	MB_CIIENT_DISCONNECTED,
	MB_CIIENT_MUTED,
	MB_CIIENT_UNMUTED,
	MB_CIIENT_HOLD,
	MB_CIIENT_UNHOLD,
	MB_CLIENT_REGISTERED,
	MB_CLIENT_UNREGISTERED,
	MB_CLIENT_RESIZE_REMOTE_VIEW,
	MB_CLIENT_RESIZE_LCOAL_VIEW
};

struct VolRange
{
	int maxval;
	int minval;
};

struct sConfig 
{
	char	username[16];
	char	password[16];
	char	displayname[16];
	char	userdomain[16];
	char	localaddr[16];
	char	localport[8];
	char	registeraddr[16];
	char	registerport[8];
	char	transporttype[8];
	char	autoAnswer[8];
	char	m_fwdUncondAddr[50];
	char	m_audioCodecs[100];
	char	m_videoCodecs[100];
	int		m_nMaxVideoBitrate;
	int		m_nMaxVideoResolution;
	int		m_nFrameRate;
	int		m_nIFrameInterval;
	int		m_nDataPrecent;
	int		m_nVideoFixed;
	int		m_nVideoSVC;
	int		m_nVideoMotionDection;
};

struct VoipClientInfo
{
	char	remotePartyURI[260];	
	char	remoteDisplayName[260];
};

MB_LIBEXPORT_API int RCInitVoipClient(int a, int b);

MB_LIBEXPORT_API void RCClientMakeCall(char* number, int* length);

class CIMVClientApi
{
public:
	CIMVClientApi();
	~CIMVClientApi();

	MBAPI int CIMVClientApi::OnSimpleCallMake(const char* remoteNum);
};

#endif //_IMV_VOIP_CLIENT_APP_H