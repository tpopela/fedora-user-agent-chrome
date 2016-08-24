/*
 * Copyright (C) 2015, 2016 Tomas Popela <tpopela@redhat.com>
 *
 * Licensed under the GNU General Public License Version 2
 *
 * This program is free software; you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation; either version 2 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program; if not, write to the Free Software
 * Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA 02110-1301 USA.
 */

(() => {
  document.addEventListener('DOMContentLoaded', () => {
    // inspired with https://developer.chrome.com/extensions/webRequest
    chrome.webRequest.onBeforeSendHeaders.addListener(
      details => {
        let anchor = document.createElement('a');

        anchor.href = details.url;
        /* It's not great that various sites are still so heavily dependant on
         * the User-Agent..
         * netflix.com - https://bugzilla.redhat.com/show_bug.cgi?id=1313244
         * onenote.com - https://bugzilla.redhat.com/show_bug.cgi?id=1368571
         */
        if (anchor.hostname !== 'www.netflix.com' &&
            anchor.hostname !== 'www.onenote.com') {
          const headers = details.requestHeaders;
          const headersLength = headers.length;

          for (let i = 0; i < headersLength; i++) {
            if (headers[i].name === 'User-Agent') {
              headers[i].value = headers[i].value.replace('; Linux', '; Fedora; Linux');
              break;
            }
          }

          return { requestHeaders: headers };
        }
      },
      {urls: ['<all_urls>']},
      ['blocking', 'requestHeaders']
    );
  });
})();
