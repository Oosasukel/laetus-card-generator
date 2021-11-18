/* eslint-disable @next/next/no-img-element */
import type { NextPage } from 'next';
import { useCallback, useMemo, useRef, useState } from 'react';
import styles from './Home.module.scss';
import { toPng, toBlob } from 'html-to-image';
import { colorMixer } from '../utils';

interface Color {
  id: number;
  name: ColorName;
}

const colorsHex: Record<ColorName, string> = {
  red: '#ff0000',
  green: '#00ff00',
  blue: '#0000ff',
  black: '#000000',
  white: '#ffffff',
};

type ColorName = 'red' | 'green' | 'blue' | 'black' | 'white';

const defaultImage = '/images/dark-magician.png';

let nextId = 4;

const Home: NextPage = () => {
  const [colors, setColors] = useState<Color[]>([
    {
      id: 1,
      name: 'red',
    },
    {
      id: 2,
      name: 'red',
    },
    {
      id: 3,
      name: 'black',
    },
  ]);
  const [attack, setAttack] = useState('2500');
  const [defense, setDefense] = useState('2100');
  const [cardImage, setCardImage] = useState(defaultImage);
  const [cardType, setCardType] = useState('Feiticeiro');
  const [cardDescription, setCardDescription] = useState(
    'O mago final em termos de ataque e defesa.'
  );
  const [cardTitle, setCardTitle] = useState('Mago Negro');
  const cardRef = useRef<HTMLDivElement>(null);
  const downloadRef = useRef<HTMLAnchorElement>(null);
  const inputImageRef = useRef<HTMLInputElement>(null);
  const mixedColor = useMemo(() => {
    if (colors.length === 0) return '#ffffff';

    let mixed = colorsHex[colors[0].name];
    colors.forEach((color, index) => {
      if (index === 0) return;

      mixed = colorMixer(mixed, colorsHex[color.name]);
    });

    return mixed;
  }, [colors]);

  const download = useCallback(() => {
    toPng(cardRef.current as HTMLElement).then((dataUrl) => {
      if (downloadRef.current) {
        downloadRef.current.href = dataUrl;
        downloadRef.current.click();
        window.URL.revokeObjectURL(dataUrl);
      }
    });
  }, []);

  const copy = useCallback(() => {
    toBlob(cardRef.current as HTMLElement).then((blob) => {
      navigator.clipboard.write([
        new ClipboardItem({
          'image/png': blob as any,
        }),
      ]);
    });
  }, []);

  const handleImageChange = useCallback(() => {
    const files = inputImageRef.current?.files;

    const hasFiles = !!files && files.length > 0;
    if (hasFiles) {
      const fileUrl = URL.createObjectURL((files as FileList)[0]);

      setCardImage(fileUrl);
    } else {
      setCardImage(defaultImage);
    }
  }, []);

  const handleImageClick = useCallback(() => {
    inputImageRef.current?.click();
  }, []);

  const addColor = useCallback((name: ColorName) => {
    setColors((prev) => [...prev, { id: nextId++, name }]);
  }, []);

  const removeColor = useCallback((id: number) => {
    setColors((prev) => {
      const allColors = [...prev];
      const colorToRemoveIndex = allColors.findIndex(
        (color) => color.id === id
      );

      if (colorToRemoveIndex != -1) {
        allColors.splice(colorToRemoveIndex, 1);
      }

      return allColors;
    });
  }, []);

  return (
    <div className={styles.container}>
      <a style={{ display: 'none' }} ref={downloadRef} download='Card.png' />

      <section className={styles.form}>
        <input
          value={cardTitle}
          onChange={(event) => setCardTitle(event.target.value)}
          name='name'
          type='text'
          placeholder='Nome'
        />
        <input
          value={cardType}
          onChange={(event) => setCardType(event.target.value)}
          name='type'
          type='text'
          placeholder='Tipo'
        />
        <input
          value={cardDescription}
          onChange={(event) => setCardDescription(event.target.value)}
          name='description'
          type='text'
          placeholder='Descrição'
        />
        <div className={styles.attributes}>
          <input
            value={attack}
            onChange={(event) => setAttack(event.target.value)}
            name='attack'
            type='text'
            placeholder='Ataque'
          />
          <input
            value={defense}
            onChange={(event) => setDefense(event.target.value)}
            name='defense'
            type='text'
            placeholder='Defesa'
          />
        </div>
        <div className={styles.colors}>
          {colors.map((color) => (
            <div
              key={color.id}
              onClick={() => removeColor(color.id)}
              className={`${styles.color} ${styles[color.name]}`}
            />
          ))}
        </div>
        <div className={styles.addColors}>
          <div
            className={`${styles.color} ${styles.red}`}
            onClick={() => addColor('red')}
          />
          <div
            className={`${styles.color} ${styles.green}`}
            onClick={() => addColor('green')}
          />
          <div
            className={`${styles.color} ${styles.blue}`}
            onClick={() => addColor('blue')}
          />
          <div
            className={`${styles.color} ${styles.black}`}
            onClick={() => addColor('black')}
          />
          <div
            className={`${styles.color} ${styles.white}`}
            onClick={() => addColor('white')}
          />
        </div>

        <div
          onClick={handleImageClick}
          className={styles.imagePreviewContainer}
        >
          <img src={cardImage} alt='Imagem' className={styles.imagePreview} />
        </div>

        <input
          ref={inputImageRef}
          id='image'
          type='file'
          onChange={handleImageChange}
        />
      </section>
      <section className={styles.cardContainer}>
        <div
          className={styles.card}
          ref={cardRef}
          style={{ backgroundColor: mixedColor }}
        >
          <div className={styles.titleContainer}>
            <span className={styles.title}>{cardTitle}</span>
            <div className={styles.colors}>
              {colors.map((color) => (
                <div
                  key={color.id}
                  className={`${styles.color} ${styles[color.name]}`}
                />
              ))}
            </div>
          </div>
          <img src={cardImage} alt='Imagem' className={styles.image} />
          <span className={styles.type}>{cardType}</span>
          <div className={styles.description}>
            <p>{cardDescription}</p>
            <div className={styles.attributes}>
              <span>ATK/{attack}</span>
              <span>DEF/{defense}</span>
            </div>
          </div>
        </div>

        <div className={styles.actions}>
          <button onClick={copy}>Copiar</button>
          <button onClick={download}>Baixar</button>
        </div>
      </section>
    </div>
  );
};

export default Home;
