"use client";

import React from 'react';
import { Folder, File } from 'lucide-react';
import { TreeItem } from '../types';
import { projectStructureTree } from '../utils';
import {
  DiagramContainer,
  TreeLine,
  IconWrapper,
  ItemName,
  Comment,
  FolderBadge,
} from '../styles';

const renderTree = (items: TreeItem[], level: number = 0): React.ReactNode => {
  return items.map((item, index) => {
    const isLast = item.isLast || index === items.length - 1;

    return (
      <React.Fragment key={`${item.name}-${index}`}>
        <TreeLine $level={level} $isLast={isLast}>
          <IconWrapper>
            {item.type === 'folder' ? <Folder size={16} /> : <File size={16} />}
          </IconWrapper>
          <ItemName $isFolder={item.type === 'folder'}>
            {item.name}
          </ItemName>
          {item.badge && <FolderBadge>{item.badge}</FolderBadge>}
          {item.comment && <Comment>// {item.comment}</Comment>}
        </TreeLine>
        {item.children && renderTree(item.children, level + 1)}
      </React.Fragment>
    );
  });
};

export const ProjectStructureDiagram: React.FC = () => {
  return (
    <DiagramContainer>
      {renderTree(projectStructureTree)}
    </DiagramContainer>
  );
};
