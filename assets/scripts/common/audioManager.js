/**
 * @description 音效控制
 */
// var Constants = require('Constants');
module.exports = {
  /**
   * @description 播放背景音乐
   * @param clip 音乐名称
   * @param finished 回调
   */
  _MusicId: null,
  _LastMusicClip: null,
  _PauseMusic: false,
  isPlayedAudio: false,//是否已经播放过音效
  _effectVolume: 1.0,
  PlayMusic: function (clip, finished) {
    this.MusicClip = clip || this.MusicClip;
    cc.log('=========this.MusicClip=========' + this.MusicClip);
    // if (!Constants.AudioConfig.MusicToggle) return;
    // if(this._LastMusicClip==clip)return;
    this._LastMusicClip = clip;
    cc.audioEngine.stopAll();
    var musicId = cc.audioEngine.playMusic(this.MusicClip, true);
    this._MusicId = musicId;
    if (finished) {
      cc.audioEngine.setFinishCallback(musicId, finished);
    }
  },
  /**
   * @description 停止播放音乐
   */
  StopMusic: function () {
    cc.audioEngine.stopMusic();
    this._LastMusicClip = null;
  },
  /**
   * @description 暂停播放音乐
   */
  HidePagePause: function () {
    console.log('HidePagePause', this._MusicId);
    try {
      if (this._MusicId) {
        this._PauseMusic = true;
        cc.audioEngine.setVolume(this._MusicId, 0.0);
        cc.audioEngine.pause(this._MusicId);
      }
    } catch (error) {
      console.log('HidePagePause---error==', error);
    }

  },
  ShowPageResume: function () {
    console.log('ShowPageResume', this._MusicId);
    try {
      if (this._MusicId) {
        this._PauseMusic = false;
        cc.audioEngine.setVolume(this._MusicId, 1.0);
        cc.audioEngine.resume(this._MusicId);
      }
    } catch (error) {
      console.log('ShowPageResume---error==', error);
    }

  },
  PauseMusic: function () {
    console.log("暂停播放音乐");
    cc.audioEngine.setVolume(this._MusicId, 0.0);
    cc.audioEngine.pause(this._MusicId);
  },
  stopAll: function () {
    cc.audioEngine.stopAll();
  },
  /**
   * @description 恢复播放音乐
   */
  ResumeMusic: function () {
    console.log("恢复播放音乐");
    cc.audioEngine.setVolume(this._MusicId, 1.0);
    cc.audioEngine.resume(this._MusicId);
  },

  setMusicVolume(value) {
    cc.audioEngine.setVolume(this._MusicId, value);
  },

  setEffectVolume(value) {
    this._effectVolume = value
  },

  /**
   * @description 播放音效
   * @param clip 音效名称
   * @param finished 回调
   */
  PlayEffect: function (clip, finished) {
    // if (!Constants.AudioConfig.EffectToggle) return;
    if (this._PauseMusic) return;
    if (clip) {
      var audioId = cc.audioEngine.playEffect(clip, false);
      cc.audioEngine.setVolume(audioId, this._effectVolume);
      this.isPlayedAudio = true;
      if (finished) {
        cc.audioEngine.setFinishCallback(audioId, finished);
      }
      return audioId;
    }
    return null;
  },
  /**
   * @description 播放赢个不停，手气不错的声音
   * @param clip 音效名称
   * @param finished 回调
   */
  PlayEffectGirlSound: function (clip, finished) {
    // if (!Constants.AudioConfig.EffectToggle) return;
    if (this._PauseMusic) return;
    if (clip) {
      var audioId = cc.audioEngine.playEffect(clip, false);
      this.isPlayedAudio = true;
      if (finished) {
        cc.audioEngine.setFinishCallback(audioId, finished);
      }
      return audioId;
    }
    return null;
  },

  StopEffect: function (id) {
    cc.audioEngine.stop(id);
  },
  /**
   * @description 停止/恢复播放背景音乐
   */
  ToggleMusic(toggle) {
    // Constants.AudioConfig.MusicToggle = toggle.isChecked;
    if (toggle.isChecked) {
      if (!cc.audioEngine.isMusicPlaying()) {
        this.PlayMusic();
      }
    } else {
      this.StopMusic();
    }
  },

  /**
   * @description 停止/恢复播放音效
   */
  ToggleEffects(toggle) {
    // Constants.AudioConfig.EffectToggle = toggle.isChecked;
  }
}

