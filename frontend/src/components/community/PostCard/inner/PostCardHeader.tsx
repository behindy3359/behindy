import React from 'react';
import { Clock, MapPin } from 'lucide-react';
import { CardHeader, AuthorInfo, AuthorLeft, Avatar, AuthorName, MetroLine, PostTime } from '../styles';

interface PostCardHeaderProps {
  authorName: string;
  userInitial: string;
  relativeTime: string;
  metroLine: string | null;
}

export const PostCardHeader: React.FC<PostCardHeaderProps> = ({
  authorName,
  userInitial,
  relativeTime,
  metroLine,
}) => {
  return (
    <CardHeader>
      <AuthorInfo>
        <AuthorLeft>
          <Avatar>{userInitial}</Avatar>
          <AuthorName>{authorName}</AuthorName>
          {metroLine && (
            <MetroLine $lineNumber={metroLine}>
              <MapPin size={10} />
              {metroLine}호선
            </MetroLine>
          )}
        </AuthorLeft>
        
        <PostTime>
          <Clock size={12} />
          {relativeTime}
        </PostTime>
      </AuthorInfo>
    </CardHeader>
  );
};